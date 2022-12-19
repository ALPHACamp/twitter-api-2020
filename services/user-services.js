const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const assert = require('assert')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const { uploadImgur } = require('../helpers/file-helpers')

const userServices = {
  // 使用者註冊
  signUp: (req, cb) => {
    const { account, email, password, checkPassword } = req.body
    let name = req.body.name
    // 驗證name內容是否超過上限字數，若超過則提示
    const nameLengthLimit = 50
    if (name.length > nameLengthLimit) {
      throw new Error(
        `Name的內容超過${nameLengthLimit}字, 請縮短!(${name.length}/${nameLengthLimit})`)
    }
    // 驗證兩次密碼輸入是否相符，若不符則提示錯誤訊息
    if (password !== checkPassword) throw new Error('請再次確認密碼!')
    // 若name未填，default為account
    if (!name) name = account
    // 使用者account & email在資料庫皆須為唯一，任一已存在資料庫則提示錯誤訊息
    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([userFindByAccount, userFindByEmail]) => {
        // account email註冊，後端驗證唯一性
        assert(!userFindByAccount, 'Account 已重複註冊!')
        assert(!userFindByEmail, 'Email 已重複註冊！')
        // input驗證OK，bcrypt密碼
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        // 建立使用者資料
        return User.create({
          account,
          name,
          email,
          password: hash
        })
      })
      .then(createdUser => {
        createdUser = createdUser.toJSON()
        // 刪除機敏資訊
        delete createdUser.password
        cb(null, { createdUser })
      })
      .catch(err => cb(err))
  },
  signIn: (req, cb) => {
    try {
      // 通過passport local驗證後的user
      const userData = req.user
      // 刪除機敏資訊
      delete userData.password
      // 發送註冊token
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      cb(null, { token, user: userData })
    } catch (err) {
      cb(err)
    }
  },
  getUser: (req, cb) => {
    return User.findByPk(req.params.user_id)
      .then(user => {
        if (!user) throw new Error("User didn't exist!")
        const userData = user.toJSON()
        delete userData.password
        cb(null, userData)
      })
      .catch(err => cb(err))
  },
  getTweetsOfUser: (req, cb) => {
    const UserId = req.params.user_id
    return Tweet.findAll({
      where: {
        UserId
      },
      order: [['createdAt', 'DESC']],
      raw: true

    })
      .then(tweetsOfUser => {
        if (!tweetsOfUser) throw new Error('此用戶沒有發過推文!')
        cb(null, tweetsOfUser)
      })
      .catch(err => cb(err))
  },
  getRepliesOfTweet: (req, cb) => {
    const UserId = req.params.user_id
    return Reply.findAll({
      where: {
        UserId
      },
      include: {
        model: User, include: Tweet
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true

    })
      .then(repliesOfTweet => {
        if (!repliesOfTweet) throw new Error('此用戶沒有發過推文回覆!')
        cb(null, repliesOfTweet)
      })
      .catch(err => cb(err))
  },
  getLikesOfUser: (req, cb) => {
    const UserId = req.params.user_id
    return Like.findAll({
      where: {
        UserId
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true

    })
      .then(likes => {
        assert(likes, 'Unexpected operation of database.')
        cb(null, likes)
      })
      .catch(err => cb(err))
  },
  getFollowingsOfUser: (req, cb) => {
    const followerId = req.params.user_id
    return Followship.findAll({
      where: {
        followerId
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true

    })
      .then(followings => {
        assert(followings, 'Unexpected operation of database.')
        cb(null, followings)
      })
      .catch(err => cb(err))
  },
  getFollowersOfUser: (req, cb) => {
    const followingId = req.params.user_id
    return Followship.findAll({
      where: {
        followingId
      },
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true

    })
      .then(followers => {
        assert(followers, 'Unexpected operation of database.')
        cb(null, followers)
      })
      .catch(err => cb(err))
  },
  editUser: (req, cb) => {
    const { name, introduction } = req.body
    assert(name, 'User name is required!')
    // 從req取得file，若有file則存至變數，若無回傳null
    const avatarFile = req.files ? req.files['avatar'][0] : null
    const coverImageFile = req.files ? req.files['coverImage'][0] : null
    // 將file上傳至Imgur & 從資料庫搜尋欲修改的使用者資訊
    return Promise.all([
      uploadImgur(avatarFile),
      uploadImgur(coverImageFile),
      User.findByPk(req.params.user_id)
    ])
      .then(([avatarFilePath, coverImageFilePath, user]) => {
        assert(name, "User doesn't exit!")
        // 更新此使用者資訊，若無傳進新file則使用原圖
        return user.update({
          name,
          introduction,
          avatar: avatarFilePath || user.avatar,
          coverImage: coverImageFilePath || user.coverImage
        })
      })
      .then(updatedUser => {
        // 刪除機敏資訊
        updatedUser = updatedUser.toJSON()
        delete updatedUser.password
        cb(null, { updatedUser })
      })
      .catch(err => cb(err))
  }
}
module.exports = userServices
