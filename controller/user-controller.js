const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
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
    if (req.body.password !== req.body.checkPassword) throw new Error('Passwords do not match')
    try {
      // check if user with given email or account already exists
      const existingAccount = await User.findOne({ where: { account: req.body.account } })
      const existingEmail = await User.findOne({ where: { email: req.body.email } })
      if (existingAccount) { throw new Error('Account already exists!') }
      if (existingEmail) { throw new Error('Email already exists!') }
      // If user does not exist, hash password and create new user
      const hash = await bcrypt.hash(req.body.password, 10)
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        account: req.body.account,
        role: 'user'
      })
      const userJSON = newUser.toJSON()
      delete userJSON.password
      return res.status(200).json(userJSON)
    } catch (err) { next(err) }
  },
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const reqUserId = helpers.getUser(req).id
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] },
        include: [
          { model: User, as: 'Followers', attributes: { exclude: ['password'] } },
          { model: User, as: 'Followings', attributes: { exclude: ['password'] } }
        ]
      })
      if (!user || user.role === 'admin') throw new Error('帳號不存在!')
      user.dataValues.isFollowed = user.Followers.map(u => u.id).includes(reqUserId)
      const userJSON = user.toJSON()
      return res.status(200).json(userJSON)
    } catch (err) { next(err) }
  },
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
      const tweetsJSON = tweets.map(t => t.toJSON())
      return res.status(200).json(tweetsJSON)
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
      const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } })
      if (!user) throw new Error('User not found!')
      const hash = await bcrypt.hash(password, 10)
      await user.update({
        name: name || user.name,
        password: hash || user.password,
        introduction: introduction || user.introduction
      })
      return res.status(200).json({ message: '修改成功' })
    } catch (err) { next(err) }
  }
}

module.exports = userController
