const jwt = require('jsonwebtoken')
const { User, Tweet } = require('../models')
const bcrypt = require('bcryptjs')

const userController = {
  login: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '10d' })
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
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.checkPassword) throw new Error('密碼與確認密碼不符，請重新輸入')
    try {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) throw new Error('此Email已被註冊！')
          return bcrypt.hash(req.body.password, 10)
        })
        .then(hash => User.create({
          name: req.body.name,
          account: req.body.account,
          email: req.body.email,
          password: hash
        }))
        .then(user => {
          res.json({ status: 'success', user })
        })
    } catch (err) {
      next(err)
    }
  },
  getUser: (req, res, next) => {
    try {
      const id = req.params.id
      User.findByPk(id, {
        include: [
          Tweet,
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
        .then(user => {
          if (!user) throw new Error('User Error!')
          user = user.toJSON()
          res.json({
            status: 'sucess',
            ...user,
            followingsCount: user.Followings.length,
            followersCount: user.Followers.length
          })
        })
    } catch (err) {
      next(err)
    }
  },
  getUserTweet: (req, res, next) => {
    try {
      const userId = req.params.id
      Tweet.findAll({
        where: { userId },
        include: User,
        nest: true,
        raw: true
      })
        .then(tweet => {
          res.json(tweet)
        })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
