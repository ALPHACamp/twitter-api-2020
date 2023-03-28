const { User, Tweet } = require('../models')
const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const helpers = require('../_helpers')

const adminController = {
  signIn: (req, res, next) => {
    try {
      const { password, ...userData } = helpers.getUser(req).toJSON()
      if (userData.role !== 'admin') throw createError(403, 'Access to the requested resource is forbidden')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      res.json({
        token,
        user: userData
      })
    } catch (error) {
      next(error)
    }
  },

  getUsers: (req, res, next) => {
    return User.findAll({
      attributes: { exclude: ['password'] },
      raw: true
    })
      .then(users => {
        res.json(users)
      })
      .catch(error => next(error))
  },

  getTweets: (req, res, next) => {
    return Tweet.findAll({
      order: [['created_at', 'desc']],
      raw: true,
      nest: true,
      include: [{ model: User, attributes: ['account', 'name', 'avatar'] }]
    })
      .then(tweets => res.json(tweets))
      .catch(error => next(error))
  },

  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.tweetId)
      .then(tweet => {
        if (tweet === null) throw createError(404, "No need to delete the tweet that doesn't exist!")
        return tweet.destroy()
      })
      .then(deleteTweet => res.json(deleteTweet))
      .catch(error => next(error))
  }
}

module.exports = adminController
