const bcrypt = require('bcryptjs')
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const { Tweet, User, Followship, Like, Reply, sequelize } = require('../models')

// JWT
const jwt = require('jsonwebtoken')
// const passportJWT = require('passport-jwt')
// const ExtractJwt = passportJWT.ExtractJwt
// const JwtStrategy = passportJWT.Strategy
const userController = {
  // 登入
  signIn: (req, res) => {
    // 取得資料
    const { email, password } = req.body
    // 檢查必要資料
    if (!email || !password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }
    // 查詢user
    User.findOne({ where: { email } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: '使用者未註冊' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: '密碼錯誤' })
      }
      // 簽發 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, 'alphacamp')
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin
        }
      })
    })
      .catch(err => {
        return res.status(500).json({ status: 'error', message: '伺服器錯誤請稍後', err })
      })
  },
  // 註冊
  signUp: async (req, res) => {
    // 取回資料
    const { account, name, email, password, checkPassword } = req.body
    // 回傳user註冊資料
    const userData = { account, name, email, password, checkPassword }
    // 判斷所有項目都到齊
    if (!account || !name || !email || !password || !checkPassword) {
      return res.status(400).json({ status: 'error', message: '所有欄位都是必填', userData })
    }
    // 判斷密碼不相符
    if (password !== checkPassword) {
      return res.status(400).json({ status: 'error', message: '密碼與確認密碼不相符', userData })
    }
    try {
      // 判斷 Account 與 Email 是否重複註冊
      const errors = []
      const [duplicateAccount, duplicateEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (duplicateAccount) {
        errors.push('帳號已重複')
      }
      if (duplicateEmail) {
        errors.push('信箱已重複')
      }
      if (errors.length) {
        return res.status(400).json({ status: 'error', message: errors, userData })
      } else {
        // 建立使用者
        const passwordBcrypt = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        User.create({
          account, name, email, password: passwordBcrypt
        }).then(user => {
          return res.status(200).json({ status: 'success', message: '註冊成功' })
        }).catch(err => res.status(500).json({ status: 'error', message: '註冊流程-伺服器錯誤請稍後', err }))
      }
    } catch (err) {
      res.status(500).json({ status: 'error', message: '註冊流程-伺服器錯誤請稍後' })
    }
  },
  // 瀏覽個人資料
  getUser: (req, res) => {
    const userId = req.params.id
    return User.findOne({
      where: { id: userId },
      attributes: {
        include: [
          [sequelize.literal(`(SELECT Count(*) FROM Followships WHERE Followships.followerId = ${userId})`), 'FollowingsCount'],
          [sequelize.literal(`(SELECT Count(*) FROM Followships WHERE Followships.followingId = ${userId})`), 'FollowersCount'],
          [sequelize.literal(`(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = ${userId})`), 'userTweetsCount'],
          [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = ${userId})`), 'likedTweetsCount'],
          [sequelize.literal(`(SELECT COUNT(*) FROM Replies WHERE Replies.UserId = ${userId})`), 'replyTweetsCount'],
        ]
      },
      raw: true,
      nest: true,
    }).then(user => {
      return res.status(200).json({ user })
    })
      .catch(err => {
        return res.status(500).json({ status: 'error', message: '個人資料-伺服器錯誤請稍後', err })
      })
  },
  // 編輯個人資料
  putUser: async (req, res) => {
    const { name, introduction } = req.body
    const userData = introduction
    // 判斷是不是登入使用者
    if (Number(req.user.id) !== Number(req.params.id)) {
      return res.json({ status: 'error', message: '無訪問權限' })
    }
    // 資料是否完整
    if (!req.body.name) {
      return res.json({ status: 'error', message: '請輸入名稱', userData })
    }
    // 建立上傳照片Functions
    function myImgurUpload(uploadFile) {
      imgur.setClientId(IMGUR_CLIENT_ID)
      return imgur.uploadFile(uploadFile)
    }
    try {
      const { files } = req
      // 撈出使用者資料
      const user = await User.findByPk(req.params.id)
      if (files) {
        // 解構賦值
        let [cover, avatar] = [user.cover, user.avatar]

        // 依序判斷 avatar & cover 是否存在 , 如果有就上傳
        if (req.files.cover) {
          cover = await myImgurUpload(req.files.cover[0].path)
        }
        if (req.files.avatar) {
          avatar = await myImgurUpload(req.files.cover[0].path)
        }

        await user.update({
          name,
          introduction,
          cover: cover.link,
          avatar: avatar.link
        })
        return res.status(200).json({ status: 'success', message: '修改成功' })
      }
      // 無照片
      user.update({ name, introduction })
      return res.status(200).json({ status: 'success', message: '修改成功' })
    } catch (err) {
      return res.status(500).json({ status: 'error', message: '編輯個人資料-伺服器錯誤請稍後' })
    }
  },
  // 使用者正在追蹤誰
  getFollowings: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Followings' }
      ]
    }).then(user => {
      const data = user.Followings.map(r => ({
        ...r.dataValues
      }))
      return res.status(200).json(data)
    })
  },
  // 誰在追蹤這個使用者
  getFollowers: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(user => {
      const data = user.Followers.map(r => ({
        ...r.dataValues
      }))
      return res.status(200).json(data)
    })
  }

}

module.exports = userController
