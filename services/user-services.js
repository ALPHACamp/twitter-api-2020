const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const assert = require('assert')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')
const { uploadImgur } = require('../helpers/file-helpers')
const helpers = require('../_helpers')
const { Op } = require('sequelize')

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
      const userData = helpers.getUser(req)
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
    const userId = helpers.getUser(req).id
    return User.findOne({
      where: { id: req.params.user_id },
      attributes: ['id', 'name', 'account', 'avatar', 'coverImage', 'introduction',
        [sequelize.literal(`(EXISTS(SELECT * FROM Followships WHERE Followships.following_id = User.id AND Followships.follower_id = ${userId}))`), 'isFollowed'], [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followerCounts'],
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followingCounts'],
        [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.User_id = User.id)'), 'tweetsCounts']
      ],
      nest: true,
      raw: true
    })
      .then(user => {
        assert(user, "User doesn't exit.")
        cb(null, { user })
      })
      .catch(err => cb(err))
  },
  getTweetsOfUser: (req, cb) => {
    const UserId = req.params.user_id
    return Tweet.findAll({
      where: {
        UserId
      },
      include: [{
        model: Like,
        attributes: [[sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Likes.id'))), 'totalLikes']]
      }, {
        model: Reply,
        attributes: [[sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Replies.id'))), 'totalReplies']]
      }],
      group: 'Tweet.id',
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => {
        assert(tweets, 'Unexpected operation of database.')
        const likedTweetId = helpers.getUser(req)?.Likes ? helpers.getUser(req).Likes.map(lt => lt.TweetId) : []
        const data = tweets.map(t => ({
          ...t,
          isLiked: likedTweetId.includes(t.id)
        }))
        cb(null, data)
      })
      .catch(err => cb(err))
  },
  getRepliesOfUser: (req, cb) => {
    const UserId = req.params.user_id
    return Reply.findAll({
      where: {
        UserId
      },
      include: [{
        model: User,
        attributes: {
          exclude: ['password']
        }
      }, {
        model: Tweet, include: [{ model: User, attributes: [['account', 'ownerAccount']] }]
      }],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(repliesOfTweet => {
        assert(repliesOfTweet, 'Unexpected operation of database.')
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
      nest: true,
      include: [
        {
          model: Tweet,
          where: { id: { [Op.ne]: null } },
          attributes: {
            include: [
              [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'totalReplies'],
              [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'totalLikes'],
              [sequelize.literal(`EXISTS(SELECT true FROM Likes WHERE Likes.User_Id = ${helpers.getUser(req).id} AND Likes.Tweet_Id = Tweet.id)`), 'isLiked']
            ]
          },
          include: [{ model: User, attributes: { exclude: ['password'] } }]
        }
      ]
    })
      .then(likes => {
        assert(likes, 'Unexpected operation of database.')
        cb(null, likes)
      })
      .catch(err => cb(err))
  },
  getFollowingsOfUser: (req, cb) => {
    return User.findAll({
      where: { id: req.params.user_id },
      attributes: [],
      include: [{
        model: User,
        as: 'Followings',
        attributes: {
          exclude: ['password']
        }
      }],
      order: [[{ model: User, as: 'Followings' }, Followship, 'createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(followings => {
        assert(followings, 'Unexpected operation of database.')
        const result = followings.map(f => ({
          followingId: f.Followings.id,
          ...f.Followings,
          isFollowed: helpers.getUser(req).Followings.some(uf => uf.Followship.followingId === f.Followings.id)
        }))
        cb(null, result)
      })
      .catch(err => cb(err))
  },
  getFollowersOfUser: (req, cb) => {
    return User.findAll({
      where: { id: req.params.user_id },
      attributes: [],
      include: [{
        model: User,
        as: 'Followers',
        attributes: {
          exclude: ['password']
        }
      }],
      order: [[{ model: User, as: 'Followers' }, Followship, 'createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(followers => {
        assert(followers, 'Unexpected operation of database.')
        const result = followers.map(f => ({
          followerId: f.Followers.id,
          ...f.Followers,
          isFollowed: helpers.getUser(req).Followings.some(uf => uf.Followship.followingId === f.Followers.id)
        }))
        cb(null, result)
      })
      .catch(err => cb(err))
  },
  editUser: (req, cb) => {
    const { name, introduction } = req.body
    assert(name, 'User name is required!')
    // 從req取得file，若有file則存至變數，若無回傳null
    const avatarFile = req.files?.avatar ? req.files.avatar[0] : null
    const coverImageFile = req.files?.coverImage ? req.files.coverImage[0] : null
    // 將file上傳至Imgur & 從資料庫搜尋欲修改的使用者資訊
    return Promise.all([
      uploadImgur(avatarFile),
      uploadImgur(coverImageFile),
      User.findByPk(req.params.user_id)
    ])
      .then(([avatarFilePath, coverImageFilePath, user]) => {
        // assert(user, "User doesn't exit!")
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
  },
  getTopUsers: (req, cb) => {
    const userId = helpers.getUser(req).id
    return User.findAll({
      where: { role: 'user' },
      attributes: ['id', 'name', 'account', 'avatar',
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCounts'],
        [sequelize.literal(`(EXISTS(SELECT * FROM Followships WHERE Followships.following_id = User.id AND Followships.follower_id = ${userId}))`), 'isFollowed']
      ],
      order: [[sequelize.literal('followerCounts'), 'DESC']],
      raw: true,
      nest: true
    })
      .then(topUsers => cb(null, { topUsers }))
      .catch(err => cb(err))
  },
  settingUser: (req, cb) => {
    if (Number(req.params.user_id) !== helpers.getUser(req).id) throw new Error("You can't set other's account!")
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
        if (userFindByAccount && userFindByAccount.id !== helpers.getUser(req).id) throw new Error('Account 已存在!')
        if (userFindByEmail && userFindByEmail.id !== helpers.getUser(req).id) throw new Error('Email 已存在！')
        // input驗證OK，bcrypt密碼
        return Promise.all([bcrypt.hash(password, 10), User.findByPk(req.params.user_id)])
      })
      .then(([hash, user]) => {
        assert(user, "User doesn't exit!")
        return user.update({
          name,
          account,
          email,
          password: hash
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
