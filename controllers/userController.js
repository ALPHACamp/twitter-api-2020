const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const userController = {
  register: (req, res) => {
    if (!req.body.name || !req.body.account || !req.body.email || !req.body.password || !req.body.confirmPassword) {
      return res.json({ status: 'error', message: 'All fields must be filled.' })
    } else if (req.body.password !== req.body.confirmPassword) {
      return res.json({ status: 'error', message: 'Password and confirm password must be the same.' })
    }
    User.findOne({ where: { $or: [{ email: req.body.email }, { account: req.body.account }] } })
      .then(user => {
        if (user) {
          if (user.email === req.body.email) {
            return res.json({ status: 'error', message: 'Email has been registered.' })
          } else if (user.account === req.body.account) {
            return res.json({ status: 'error', message: 'Already have the same account.' })
          }
        } else {
          User.create({
            name: req.body.name,
            account: req.body.account,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
            role: 'user'
          })
            .then(user => {
              return res.json({ status: 'success', message: 'Registration success.' })
            })
            .catch(error => res.send(String(error)))
        }
      })
      .catch(error => res.send(String(error)))
  },
  login: (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.json({ status: 'error', message: 'Please fill in the email and password.' })
    }
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (!user) {
          return res.json({ status: 'error', message: 'Email could not be found.' })
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
          return res.json({ status: 'error', message: 'Email or password entered incorrectly.' })
        }
        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.json({
          status: 'success',
          message: 'welcome twitter',
          token,
          user: { id: user.id, name: user.name, email: user.email, role: user.role }
        })
      })
      .catch(error => res.send(String(error)))
  },
  getTweets: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        Tweet.findAll({ where: { UserId: req.params.id }, include: [{ model: User, as: 'LikedUsers' }, Reply], order: [['createdAt', 'DESC']] })
          .then(tweet => {
            res.json({ user, tweet })
          })
          .catch(error => res.send(String(error)))
      })
      .catch(error => res.send(String(error)))
  }
}

module.exports = userController