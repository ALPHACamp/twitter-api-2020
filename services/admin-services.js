const { User, Tweet } = require('./../models')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')

const adminServices = {
  loginAdmin: (req, cb) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      cb(null, {
        token,
        admin: userData
      })
    } catch (err) {
      cb(err)
    }
  },
  getUsers: (req, cb) => {
    return User.findAll({
      attributes: { exclude: ['password'] }
    })
      .then(users => {
        return cb(null, users)
      })
      .catch(err => cb(err))
  },
  deleteTweet: (req, cb) => {
    const TweetId = req.params.tweetId
    return Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) throw new Error('Tweet does not exist!')
        return tweet.destroy()
      })
      .then(deletedTweet => cb(null, { status: 'success', deletedTweet })
      )
      .catch(err => cb(err))
  }
}
module.exports = adminServices
