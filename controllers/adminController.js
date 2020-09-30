const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const adminController = {
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
    Tweet.findAll({ include: [User], order: [['createdAt', 'DESC']] })
      .then(tweet => {
        const tweetArray = tweet.map(t => ({
          ...t.dataValues,
          description: t.dataValues.description.substring(0, 50)
        }))
        res.json(tweetArray)
      })
      .catch(error => res.send(String(error)))
  },

  getUsers: (req, res) => {
    User.findAll({
      include: [
        Reply, Like,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }],
      order: [[{ model: Reply }, 'createdAt', 'DESC']]
    })
      .then(user => {
        res.json(user)
      })
      .catch(error => res.send(String(error)))
  },

  deleteTweet: (req, res) => {
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        tweet.destroy()
      })
      .then(tweet => {
        return res.json({ status: 'success', message: 'Successfully deleted.' })
      })
      .catch(error => res.send(String(error)))
  }
}

module.exports = adminController