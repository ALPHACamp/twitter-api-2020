const jwt = require('jsonwebtoken')
const { User, Tweet, Like } = require('../models')
const passport = require('../config/passport')

const adminController = {
  login: (req, res, next) => {
    passport.authenticate('local', { session: false, failWithError: true }, (err, user, info) => {
      // err: null & user: false => 400
      if (!err && !user) {
        const error = new Error('輸入資料不可為空值!')
        error.status = 400
        return next(error)
      }

      if (err || !user) {
        if (err.status === 401) {
          return next(err)
        }
      }
      if (user.role !== 'admin') {
        const error = new Error('驗證失敗!')
        error.status = 401
        return next(error)
      }
      try {
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
        res.json({
          token,
          user: { id: userData.id }
        })
      } catch (err) {
        return next(err)
      }
    })(req, res, next)
  },
  getUsers: (req, res, next) => {
    User.findAll({
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet },
        { model: Like }
      ]
    })
      .then(users => {
        const usersData = users.map(user => {
          const transformedData = {
            ...user.toJSON(),
            followerCounts: user.Followers.length,
            followingCounts: user.Followings.length,
            tweetCounts: user.Tweets.length,
            likeCounts: user.Likes.length
          }
          delete transformedData.password
          delete transformedData.role
          delete transformedData.Followers
          delete transformedData.Followings
          delete transformedData.Tweets
          delete transformedData.Likes
          return transformedData
        })
          .sort((a, b) => b.tweetCounts - a.tweetCounts)

        res.json(usersData)
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          const err = new Error('此推文不存在！')
          err.status = 404
          throw err
        }
        return tweet.destroy()
      })
      .then(deletedTweet => res.status(200).send())
      .catch(err => next(err))
  }

}

module.exports = adminController
