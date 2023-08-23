const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { User, Tweet, Reply, Like } = require('../models')

const userController = {
  // No.1 - 註冊帳號 POST /api/users
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword, introduction, avatar, banner } = req.body
      const cause = { // 定義不同的錯誤訊息，以便前端顯示之用
        accountErrMsg: '',
        nameErrMsg: '',
        emailErrMsg: '',
        passwordErrMsg: '',
        checkPasswordErrMsg: ''
      }

      // 確認必填值是否為空
      if (!account) cause.accountErrMsg += '此為必填欄位。'
      if (!name) cause.nameErrMsg += '此為必填欄位。'
      if (!email) cause.emailErrMsg += '此為必填欄位。'
      if (!password) cause.passwordErrMsg += '此為必填欄位。'
      if (!checkPassword) cause.checkPasswordErrMsg += '此為必填欄位。'
      if (cause.accountErrMsg || cause.nameErrMsg || cause.emailErrMsg || cause.passwordErrMsg || cause.checkPasswordErrMsg) {
        throw new Error('Empty input value!', { cause })
      }

      // 確認checkPassword是否相符 & name是否在50字之內
      if (password !== checkPassword) cause.checkPasswordErrMsg += '確認密碼不相符。'
      if (name.length > 50) cause.nameErrMsg += '名稱不得超過50字。'

      // 確認account或email是否重複
      const [user1, user2] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (user1) cause.accountErrMsg += 'account 已重複註冊！'
      if (user2) cause.emailErrMsg += 'email 已重複註冊！'

      if (cause.accountErrMsg || cause.nameErrMsg || cause.emailErrMsg || cause.passwordErrMsg || cause.checkPasswordErrMsg) {
        throw new Error('Inproper input value!', { cause })
      }

      // 若無錯誤則建立新帳號
      const hash = await bcrypt.hash(password, 10)
      const user = await User.create({
        account,
        name,
        email,
        password: hash,
        introduction: introduction || '',
        avatar: avatar || 'https://via.placeholder.com/224',
        banner: banner || 'https://images.unsplash.com/photo-1580436541340-36b8d0c60bae',
        role: 'user'
      })

      const userData = user.toJSON()
      delete userData.password

      return res.status(200).json({ status: 'success', data: userData })
    } catch (err) {
      return next(err)
    }
  },
  // No.2 - 登入前台帳號 POST /api/users/signin
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      // 角色若不是user則不發給token
      if (userData.role !== 'user') throw new Error('no such user(角色錯誤)', { cause: { accountErrMsg: '帳號不存在！', passwordErrMsg: '' } })

      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      return res.status(200).json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      return next(err)
    }
  },
  // No.3 - 查看某使用者的資料 GET /api/users/:id
  // No.4 - 查看某使用者發過的推文 GET /api/users/:id/tweets
  getUserTweets: async (req, res, next) => {
    try {
      const UserId = req.params.id
      let tweets = await Tweet.findAll({ where: { UserId }, include: [User], nest: true })

      tweets = tweets.map(tweet => tweet.toJSON())
      tweets.forEach(tweet => delete tweet.User.password)

      return res.status(200).json({ success: true, data: { tweets } })
    } catch (err) {
      return next(err)
    }
  },
  // No.5 - 查看某使用者發過的回覆 GET /api/users/:id/replied_tweets
  getUserReplies: (req, res, next) => {
    return res.status(200).json({})
  },
  // No.6 - 查看某使用者點過like的推文 GET /api/users/:id/likes
  getUserLikes: (req, res, next) => {
    return res.status(200).json({})
  }
}

module.exports = userController
