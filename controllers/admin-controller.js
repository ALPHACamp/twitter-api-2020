const { User, Tweet } = require('../models')
const jwt = require('jsonwebtoken')

const adminController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (error) {
      next(error)
    }
  },

  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true
    })
      .then(users => res.json({ status: 'success', users }))
      .catch(error => next(error))
  },

  getTweets: (req, res, next) => {
    return Tweet.findAll({
      order: [['created_at', 'desc']],
      raw: true,
      nest: true,
      include: [User]
    })
      .then(tweets => res.json({ status: 'success', tweets }))
      .catch(error => next(error))
  },

  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.tweetId)
      .then(tweet => {
        if (!tweet) {
          const error = new Error("Tweet doesn't exist!")
          error.status = 404
          throw error
        }

        return tweet.destroy()
      })
      .then(deleteTweet => res.json({ status: 'success', deleteTweet }))
      .catch(error => next(error))
  }
}

module.exports = adminController
