const helpers = require('../_helpers')
const jwt = require('jsonwebtoken')

const { Tweet, User, Like } = require('../models')

const adminController = {
  login: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      if (userData.role !== 'admin') throw new Error('User account cannot enter back-end!')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
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
  getUsers: (req, res, next) => {
    return User.findAll({
      include: [
        { model: Tweet, include: Like },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(users => {
        const data = users.map(user => {
          let likedAmount = 0
          user.Tweets.forEach(tweet => {
            likedAmount += tweet.Likes.length
          })
          user = {
            ...user.toJSON(), // 之後要再研究為什麼不帶入toJSON()會有 error: TypeError: Converting circular structure to JSON
            tweetAmount: user.Tweets.length,
            likedAmount,
            followingAmount: user.Followings.length,
            followerAmount: user.Followers.length
          }
          delete user.Tweets
          delete user.Followers
          delete user.Followings
          return user
        })
        res.json(data.sort((a, b) => b.tweetAmount - a.tweetAmount))
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error("tweet didn't exist!")
        return tweet.destroy()
      })
      .then(deletedTweet => {
        res.json(deletedTweet)
      })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: User,
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        tweets = tweets.map(tweet => {
          const { id, account, name, avatar } = tweet.User
          tweet = {
            ...tweet.toJSON(),
            User: {
              id,
              account,
              name,
              avatar
            }
          }
          return tweet
        })
        res.json(tweets)
      })
      .catch(err => {
        next(err)
      })
  }
}
module.exports = adminController
