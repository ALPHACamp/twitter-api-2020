const jwt = require('jsonwebtoken')
const { User, Tweet } = require('../models')
const { getUser } = require('../_helpers')
const bcrypt = require('bcryptjs')
const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '7d' })
      res.json({
        status: 'success',
        token,
        data: {
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Password do not match!')
    if (req.body.name.length > 50) throw new Error('Max length 50')
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(data => {
        userData = data.toJSON()
        delete userData.password
        res.json({ status: 'success', data: userData })
      })
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    const userId = req.params.id
    Promise.all([
      User.findOne({
        where: { id: userId },
        raw: true
      }),
      Tweet.findAll({
        where: { UserId: userId },
        raw: true
      })
    ])
      .then(([data, tweets]) => {
        delete data.password
        data.tweetsCounts = tweets.length
        res.json({ status: 'success', data })
      })
      .catch(err => next(err))
  }
}
module.exports = userController