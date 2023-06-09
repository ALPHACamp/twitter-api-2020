const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like } = require('../models')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const { NUMBER } = require('sequelize')
const userController = {
  signIn: async (req, res, next) => {
    try {
      const { account, password } = req.body
      if (!account || !password) throw new Error('account & password are required!')
      const user = await User.findOne({ where: { account } })
      if (!user || user.role === 'admin') throw new Error('帳號不存在!')
      if (!bcrypt.compareSync(password, user.password)) throw new Error('password incorrect!')
      const userJSON = user.toJSON()
      delete userJSON.password
      const token = jwt.sign(userJSON, process.env.JWT_SECRET, { expiresIn: '30d' })// 簽證效期30天
      return res.status(200).json({ token, user: userJSON })
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
  }
}

module.exports = userController
