const jwt = require('jsonwebtoken')
const { User, Tweet, Reply, Like } = require('../models')
const helpers = require('../_helpers')


const adminController = {
  signIn: (req, res, next) => {
    try {
      if (helpers.getUser(req) && helpers.getUser(req).role !== 'admin') {
        return res.status(403).json({ status: 'error', message: "此帳號不存在！" })
      }

      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        },
        message: '成功登入！'
      })
    } catch (err) {
      next(err)
    }
  },
  getUsers: (req, res, next) => {

    User.findAll({
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Like, include: Tweet }
      ]
    })
      .then(users => {
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            followingCount: user.Followings.length,
            tweetCount: user.Tweets.length,
            likeCount: user.Likes.length
          }))
          .map(user => {

            user.Followers.map(follower => {
              delete follower.password
            })

            user.Followings.map(following => {
              delete following.password
            })
            
            delete user.password
            return user
          })
          .sort((a, b) => b.Tweets.length - a.Tweets.length)
        return res.status(200).json(result)
      })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    Tweet.findAll({
      include: User
    })
      .then(tweets => {
        const result = tweets.map(tweet => ({
          ...tweet.toJSON(),
          description: tweet.description.substring(0, 50)
        }))
          .map(tweet => {
            delete tweet.User.password
            return tweet
          })
        return res.status(200).json(result)
      })
      .catch(err => next(err))
  },
  deleteTweet: (req, res, next) => {
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error('此推文已不存在！')
        
        return tweet.destroy()
      })

      .then(data => res.status(200).json({
        status: 'success',
        message: '推文已刪除',
        data
      }))
      .catch(err => next(err))
  }

}

module.exports = adminController
