const { User, Tweet } = require('../models')
const helpers = require('../_helpers')
const jwt = require('jsonwebtoken')

const adminController = {
  getUsers: (req, res, next) => {
    return User.findAll({
      attributes: { exclude: ['password'] },
      raw: true,
      nest: true
    })
      .then(users => {
        res.status(200).json(users)
      })
      .catch(err => next(err))
  },
  signin: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.status(200).json({
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
  deleteTweet: (req, res, next) => {
    const tweetId = req.params.id
    return Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) throw new Error('沒這篇耶')
        tweet.destroy()
      })
      .then(tweet => res.status(200).json({ message: '推文已刪除' }))
      .catch(err => next(err))
  }
}

module.exports = adminController
