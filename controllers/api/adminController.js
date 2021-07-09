const db = require('../../models')
const User = db.User
const Tweet = db.Tweet
const Admin = db.Admin
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')

let defaultLimit = 10

let adminController = {
  getUsers: (req, res) => {
    const options = {
      limit: +req.query.limit || defaultLimit,
      offset: +req.query.offset || 0,
      raw: true,
      attributes: { exclude: ['email', 'introduction', 'password', 'lastLoginAt', 'updatedAt', 'createdAt'] }
    }
    User.findAll(options)
      .then((users) => {
        users.forEach((user) => {
          if (user.introduction) {
            user.introduction = user.introduction.substring(0, 50)
          }
        })
        res.status(200).json(users)
      })
      .catch((error) => {
        res.status(404).json({ status: 'error', message: '' })
      })
  },
  getTweets: (req, res) => {
    const options = {
      limit: +req.query.limit || defaultLimit,
      offset: +req.query.offset || 0,
      attributes: ['id', 'description', 'likeNum', 'replyNum', 'createdAt'],
      order: [['createdAt', 'desc']],
      include: [
        {
          model: User,
          attributes: ['id', 'account', 'name', 'avatar'],
          as: 'User'
        }
      ]
    }
    Tweet.findAll(options)
      .then((tweets) => {
        tweets.forEach((tweet) => {
          tweet.description = tweet.description.substring(0, 50)
        })
        return res.status(200).json(tweets)
      })
      .catch(() => res.status(404).json({ status: 'error', message: '' }))
  },
  deleteTweet: (req, res) => {
    Tweet.findByPk(req.params.tweetId)
      .then((tweet) => tweet.destroy())
      .then(() =>
        res
          .status(200)
          .json({ status: 'success', message: 'Successfully delete tweet.' })
      )
      .catch(() =>
        res
          .status(403)
          .json({ status: 'error', message: 'Permission is denied' })
      )
  },
  login: (req, res) => {
    const { password, email } = req.body
    if (!password || !email) {
      return res.status(401).json({
        status: 'error',
        message: 'password or email can not be empty'
      })
    }

    User.findOne({ where: { email } })
      .then((user) => {
        if (!user) {
          return res
            .status(401)
            .json({ status: 'error', message: 'this admin user is not exist' })
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return res
            .status(401)
            .json({ status: 'error', message: 'password is not correct' })
        }

        let payload = {
          id: user.id
        }
        let token = jwt.sign(payload, process.env.JWT_SECRET)
        return res.status(200).json({
          status: 'success',
          message: 'ok',
          token,
          User: {
            id: user.id,
            name: user.name,
            email: user.email
          }
        })
      })
      .catch((error) =>
        res.status(401).json({ status: 'error', message: error })
      )
  }
}

module.exports = adminController
