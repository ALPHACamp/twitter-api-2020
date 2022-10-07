const { User, Tweet, Like, Followship } = require('../models')
const jwt = require('jsonwebtoken')
const helpers = require('../_helpers')

const adminController = {
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req)?.toJSON()
      if (userData.role !== 'admin') {
        throw new Error('帳號不存在')
      }
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        token,
        userData
      })
    } catch (err) {
      next(err)
    }
  },
  getUsers: (req, res, next) => {
    User.findAll({
      attributes: ['id', 'account', 'name', 'profilePhoto', 'coverPhoto'],
      include: [
        { model: User, as: 'Followers', attributes: ['id'], through: { attributes: [] } },
        { model: User, as: 'Followings', attributes: ['id'], through: { attributes: [] } },
        { model: Tweet, include: Like, attributes: ['id'] }
      ]
    })
      .then(users => {
        const result = users.map(user => ({
          ...user.toJSON(),
          followerCount: user.Followers.length,
          followingCount: user.Followings.length,
          tweetsCount: user.Tweets.length
        }))
        res.json(result)
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    const id = req.params.id
    Tweet.findByPk(id)
      .then(tweet => {
        return tweet.destroy()
      })
      .then(deletetweet => { res.json(deletetweet) })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: [{ model: User, attributes: ['id', 'account', 'name', 'profilePhoto'] }],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        res.json(tweets)
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
