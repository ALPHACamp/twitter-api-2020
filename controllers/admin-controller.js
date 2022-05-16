const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User, Tweet, Followship, Like } = require('../models')
const { getFollowers } = require('./user-controller')

const adminController = {
  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true,
      nest: true,
      include: [Tweet]
    })
      .then(users => {
        const Tweets = req.user?.Tweets ? req.user.Tweets.map(tweet => tweet.length) : []
        const Likes = req.user?.LikedTweets ? req.user.LikedTweets.map(lt => lt.length) : []
        const Replies = req.user?.LikedReplies ? req.user.LikedReplies.map(lr => lr.length) : []
        const Followers = req.user?.Followers ? req.user.Followers.map(fr => fr.length) : []
        const Followings = req.user?.Followings ? req.user.Followings.map(fg => fg.length) : []
        const data = users.map(user => ({
          ...user,
          Tweets,
          Likes,
          Replies,
          Followers,
          Followings
        })
        )
        return data
      })
      .then(data => {
        res.json({
          status: 'Success',
          statusCode: 200,
          data: {
            data
          },
          message: 'Tweet deleted!'
        })
      })
      .catch(err => next(err))
  },
  deleteTweets: (req, res, next) => {
    const id = req.params.id
    return Tweet.findByPk(id)
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        return tweet.destroy()
      })
      .then(() => res.json({
        status: 'Success',
        statusCode: 200,
        message: 'Tweet deleted!'
      }))
      .catch(err => next(err))
  }
}

module.exports = adminController
