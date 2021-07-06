const { User } = require('../models')
const { Tweet } = require('../models')
const { Reply } = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



const userController = {

  signup: async (req, res, next) => {
    try {
      const { name, account, email, password, confirmPassword } = req.body
      if (!name || !account || !email || !password || !confirmPassword) return res.json({ status: 'error', message: '請填入所有欄位' })
      if (password !== confirmPassword) return res.json({ status: 'error', message: '密碼與確認密碼不符' })
      let user = await User.findOne({ where: { email } })
      if (user) return res.json({ status: 'error', message: `此信箱已註冊` })
      user = await User.findOne({ where: { account } })
      if (user) return res.json({ status: 'error', message: `此帳號已有人使用` })

      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(password, salt)
      await User.create({
        name,
        account,
        email,
        password: hashPassword
      })
      return res.json({ status: 'success', message: '註冊成功' })
    }
    catch (err) {
      next(err)
    }
  },

  signin: async (req, res, next) => {
    try {
      const { account, password } = req.body
      if (!account || !password) return res.json({ status: 'error', message: '請填入所有欄位' })

      const user = await User.findOne({ where: { account } })
      if (!user) return res.status(401).json({ status: 'error', message: '查無此使用者' })
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return res.status(401).json({ status: 'error', message: '密碼輸入錯誤' })

      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token,
        user: {
          id: user.id, account: user.account, name: user.name, email: user.email, isAdmin: user.isAdmin
        }
      })
    }
    catch (err) {
      next(err)
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (user === null) { return { status: 'error', message: '使用者不存在' } }
      return res.json(user)
      // return res.json({ key: 'test' })
    } catch (err) { next(err) }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({ where: { UserId: req.params.id } })
      if (tweets.length === 0) {
        return res.json({ status: 'error', message: '使用者暫無貼文' })
      }
      return res.json(tweets)
    } catch (err) { next(err) }
  },
  getUserRepliedTweets: async (req, res, next) => {
    try {
      const replies = await Reply.findAll({
        where: { UserId: req.params.id },
        include: [Tweet]
      })
      const tweets = await replies.map(reply => reply.Tweet)
      if (tweets.length === 0) return res.json({ status: 'error', message: '沒有回覆的推文' })
      return res.json(tweets)
    } catch (err) { next(err) }
  },
  getUserLikeTweet: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [Tweet]
      })
      return res.json(user)
    } catch (err) { next(err) }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followings' }]
      })
      const followings = user.Followings
      return res.json(followings)
    } catch (err) { next(err) }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [
          { model: User, as: 'Followers' }]
      })
      const followers = user.Followers
      return res.json(followers)
    } catch (err) { next(err) }
  },
  putUser: async (req, res, next) => {
    try {
      const { name, email, password, account, role, bio } = req.body
      const { avatar, cover } = req.files
    } catch (err) { next(err) }
  },
}

module.exports = userController