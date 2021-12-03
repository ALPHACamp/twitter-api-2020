const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply

const adminController = {
  signIn: (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }

    User.findOne({ where: { email } }).then(user => {
      if (!user) {
        return res.json({ status: 'error', message: "no such user found" })
      }
      if (user.role !== 'admin') {
        return res.json({ status: 'error', message: "no such user found" })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.json({ status: 'error', message: "passwords did not match" })
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      })
    })
  },

  getTweets: (req, res) => {
    Tweet.findAll({ order: [['createdAt', 'DESC']] })
      .then(tweets => {
        tweets = tweets.map(t => ({
          ...t.dataValues,
          description: t.description.substring(0, 50)
        }))
        return res.json(tweets)
      })
  },

  deleteTweet: (req, res) => {
    Tweet.destroy({ where: { id: req.params.id } })
      .then(() => res.json({ status: 'success', message: '' }))
  },

  getUsers: (req, res) => {
    User.findAll({
      include: [
        Like,
        Reply,
        { model: User, as: 'Followings'},
        { model: User, as: 'Followers' }
      ],
      order: [['name', 'ASC']]
    })
      .then(users => {
        return res.json(users)
      })
  }
}

module.exports = adminController
