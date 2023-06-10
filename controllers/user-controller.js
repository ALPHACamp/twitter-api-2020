if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const userDummy = require('./dummy/users-dummy.json')
const { User, Tweet, Reply, Like } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')

const userController = {
  getUsers: (req, res, next) => {
  },
  getUser: (req, res, next) => {
    helpers.getUser(req)
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error('getUser查無此人')
        // res.json({ status: 'success', user: user.toJSON() })
        res.json(user.toJSON())
      })
  },
  getTopUsers: (req, res, next) => {
    console.log('users_getTopUser')
    res.json(userDummy.getTopUsers)
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('Password do not match!')
    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => {
        return User.create({
          account,
          name,
          email,
          password: hash,
          avatar: 'https://i.imgur.com/V4RclNb.png',
          banner: 'https://i.imgur.com/ZFz8ZEI.png',
          role: 'user'
        })
      })
      .then(signUpUser => {
        res.json({ status: 'success', signUpUser })
      })
      .catch(err => next(err))
  },
  signIn: async (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      // JWT (A, B, C)
      // A: payload, 要打包的資訊; B: 密鑰, 使用.env來寫; C: 設定, 這邊設定有效天數
      // process.env.JWT_SECRET
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  // userRequest #3
  getUserTweets: (req, res, next) => {
    const userId = Number(req.params.id)
    return Promise.all([
      User.findByPk(userId, { raw: true }),
      Tweet.findAll({
        where: { userId },
        include: [
          { model: User },
          { model: Reply },
          { model: Like }
        ],
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([user, tweetsData]) => {
        if (!user) throw new Error('getUserTweets說沒這人')
        const tweets = tweetsData.map(t => ({
          ...t.toJSON(),
          repliesCount: t.Replies.length,
          likesCount: t.Likes.length
        }))
        res.json(tweets)
      })
      .catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
  }
}

module.exports = userController
