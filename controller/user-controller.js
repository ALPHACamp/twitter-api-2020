const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like } = require('../models')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')
const userController = {
  signIn: async (req, res, next) => {
    try {
      const { account, password } = req.body
      if (!account || !password) throw new Error('account & password are required!')
      const user = await User.findOne({ where: { account } })
      if (!user || user.role === 'admin') throw new Error('帳號不存在!')
      if (!bcrypt.compareSync(password, user.password)) throw new Error('password incorrect!')
      const userData = user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })// 簽證效期30天
      return res.status(200).json({ token, user: userData })
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
      return res.json({ status: 'success', data: { user: userJSON } })
    } catch (err) { next(err) }
  },
  getCurrentUser: (req, res, next) => {
    const reqUser = helpers.getUser(req)
    const result = reqUser.toJSON()
    delete result.password
    delete result.Followers
    delete result.Followings
    return res.status(200).json(result)
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
      const userId = req.params.id
      // Make sure user exists or is not admin
      const user = await User.findByPk(userId, {
        raw: true,
        nest: true,
        include: [
          {
            model: Tweet,
            include: [Reply, Like]
          }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!user || user.role === 'admin') throw new Error('user does not exist')

      const tweets = user.dataValues.Tweets.map(tweet => ({
        id: tweet.id,
        description: tweet.description,
        createdAt: tweet.createdAt,
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length
      }))
      return res.status(200).json(tweets)
    } catch (error) {
      next(error)
    }
  }

}

module.exports = userController
