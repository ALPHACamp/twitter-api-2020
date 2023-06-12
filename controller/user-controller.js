const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const validator = require('email-validator')
const userController = {
  signIn: async (req, res, next) => {
    try {
      const userJSON = req.user.toJSON()
      delete userJSON.password
      const token = jwt.sign(userJSON, process.env.JWT_SECRET, { expiresIn: '30d' })// 簽證效期30天
      return res.status(200).json({ token, message: '登入成功' })
    } catch (err) { next(err) }
  },
  signUp: async (req, res, next) => {
    try {
      const { name, email, password, account, checkPassword } = req.body
      if (!name || !email || !password || !account || !checkPassword) throw new Error('請填寫所有必填欄位')
      // Check password and check Password must be the same
      if (password !== checkPassword) throw new Error('Passwords do not match')
      // Check name.length must < 50
      if (name.length > 51) throw new Error('使用者註冊名稱(name)上限為50字')
      // Check if email matches the required format
      if (!validator.validate(email)) throw new Error('Email格式不正確!')
      // check if user with given email or account already exists
      const existingAccount = await User.findOne({ where: { account: req.body.account } })
      const existingEmail = await User.findOne({ where: { email: req.body.email } })
      if (existingAccount) { throw new Error('account已重複註冊!') }
      if (existingEmail) { throw new Error('email已重複註冊!') }
      // If user does not exist, hash password and create new user
      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({
        name,
        email,
        password: hash,
        account,
        role: 'user'
      })
      return res.status(200).json({ message: 'Signup successfully!' })
    } catch (err) { next(err) }
  },
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const reqUserId = helpers.getUser(req).id
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] },
        include: [
          Tweet,
          { model: User, as: 'Followers', attributes: { exclude: ['password'] } },
          { model: User, as: 'Followings', attributes: { exclude: ['password'] } }
        ]
      })
      if (!user || user.role === 'admin') throw new Error('帳號不存在!')
      user.dataValues.isFollowed = user.Followers.map(u => u.id).includes(reqUserId)
      return res.status(200).json(user)
    } catch (err) { next(err) }
  },
  // const reqUserId = helpers.getUser(req).id
  getUserTweets: async (req, res, next) => {
    try {
      const userId = Number(req.params.id)
      const user = await User.findByPk(userId)
      if (!user) throw new Error('此用戶不存在')
      const tweets = await Tweet.findAll({
        where: { UserId: userId },
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Like, attributes: ['userId'] }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (tweets.length === 0) throw new Error('此用戶尚未發布推文')
      return res.status(200).json(tweets)
    } catch (err) { next(err) }
  },
  getUserReplies: async (req, res, next) => {
    try {
      const userId = req.params.id
      const userReplies = await Reply.findAll({
        where: { UserId: userId },
        include: [
          { model: Tweet }
        ],
        order: [['createdAt', 'DESC']]
      })
      const RepliesJSON = userReplies.map(r => r.toJSON())
      if (RepliesJSON.length === 0) throw new Error('此用戶沒有回覆任何貼文')
      return res.status(200).json(RepliesJSON)
    } catch (err) { next(err) }
  },
  getLikedTweets: async (req, res, next) => {
    try {
      const userId = req.params.id
      const likesTweets = await Like.findAll({
        where: { UserId: userId },
        include: [
          { model: Tweet }
        ],
        order: [['createdAt', 'DESC']]
      })
      const likesJSON = likesTweets.map(l => l.toJSON())
      if (likesJSON.length === 0) throw new Error('此用戶沒有對任何貼文按讚')
      return res.status(200).json(likesJSON)
    } catch (err) { next(err) }
  },
  getFollowings: async (req, res, next) => {
    try {
      const userId = req.params.id
      const followships = await Followship.findAll({
        where: { followerId: userId },
        include: [
          { model: User, as: 'Followings', attributes: { exclude: ['password'] } }
        ]
      })

      if (followships.length === 0) throw new Error('該用戶無正在追蹤對象')
      return res.status(200).json(followships)
    } catch (err) { next(err) }
  },
  getFollowers: async (req, res, next) => {
    try {
      const userId = req.params.id
      const followships = await Followship.findAll({
        where: { followingId: userId },
        include: [
          { model: User, as: 'Followers', attributes: { exclude: ['password'] } }
        ]
      })
      // delete followships.Followers.password
      if (followships.length === 0) throw new Error('該用戶無正在追蹤對象')
      return res.status(200).json(followships)
    } catch (err) { next(err) }
  },
  putUser: async (req, res, next) => {
    try {
      const { name, password, introduction } = req.body
      const userId = helpers.getUser(req).id
      const user = await User.findByPk(userId)
      if (!user) throw new Error('User not found!')
      let hash = user.password
      if (password) {
        hash = await bcrypt.hash(password, 10)
      }
      await user.update({
        name: name || user.name,
        password: hash,
        introduction: introduction || user.introduction
      })
      return res.status(200).json({ message: '修改成功' })
    } catch (err) { next(err) }
  }

}

module.exports = userController
