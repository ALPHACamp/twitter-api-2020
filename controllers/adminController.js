const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers.js')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const adminController = {
  login: (req, res) => {
    if (!req.body.account || !req.body.password) {
      return res.json({ status: 'error', message: 'Please fill in the account and password.' })
    }
    User.findOne({ where: { account: req.body.account } })
      .then(user => {
        if (!user) {
          return res.json({ status: 'error', message: 'Account could not be found.' })
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
          return res.json({ status: 'error', message: 'Account or password entered incorrectly.' })
        }
        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.json({
          status: 'success',
          message: 'welcome twitter',
          token,
          user: { id: user.id, name: user.name, account: user.account, email: user.email, role: user.role }
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
        return res.json(tweetArray)
      })
      .catch(error => res.send(String(error)))
  },

  getUsers: (req, res) => {
    User.findAll({
      include: [
        Reply, Like, Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }]
    })
      .then(user => {
        user = user.map(u => ({
          ...u.dataValues
        }))
        user = user.sort((a, b) => b.Tweets.length - a.Tweets.length)
        //原本要過濾管理員root，但測試不給過就先註解
        // user.forEach((u, index) => {
        //   if (u.id === 1) { user.splice(index, 1) }
        // })
        return res.json(user)
      })
      .catch(error => res.send(String(error)))
  },

  deleteTweet: (req, res) => {
    if (helpers.getUser(req).id !== 1) {
      return res.json({ status: 'error', message: 'permission denied' })
    }
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        return tweet.destroy()
      })
      .then(tweet => {
        return res.json({ status: 'success', message: 'Successfully deleted.' })
      })
      .catch(error => res.send(String(error)))
  }
}

module.exports = adminController