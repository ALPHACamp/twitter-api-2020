const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const { User, Tweet, Like, Reply } = require('../models')

const adminController = {
  signin: async (req, res, next) => {
    try {
      if (req.user.error) {
        return res.status(StatusCodes.NOT_ACCEPTABLE)
          .json(req.user.error)
      }
      const user = req.user.toJSON()
      if (user.role !== 'admin') {
        return res.status(StatusCodes.FORBIDDEN)
          .json({

            status: 'error',
            message: '無管理員權限'
          })
      }
      const payload = {
        id: user.id
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' })
      delete user.password
      return res.status(StatusCodes.OK)
        .json({
          status: 'success',
          message: '成功登入',
          token,
          data: user
        })
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      let users = await User.findAll({
        include: [
          { model: Tweet, include: { model: Like } },
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      })
      if (!users) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: 'Users不存在'
        })
      }
      users = await users.map(user => ({ ...user.toJSON() }))
      users.forEach(user => {
        user.tweetsCounts = user.Tweets.length
        user.followingsCounts = user.Followings.length
        user.followersCounts = user.Followers.length
        user.likedTweetsCounts = user.Tweets.reduce((prev, next) => prev + next.Likes.length, 0)
        delete user.password
        delete user.Tweets
        delete user.Followings
        delete user.Followers
      })
      users.sort((a, b) => {
        if (a.tweetsCounts === b.tweetsCounts) return (a.id - b.id)
        return (b.tweetsCounts - a.tweetsCounts)
      })
      return res.status(StatusCodes.OK).json(users)
    } catch (error) {
      next(error)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      let tweets = await Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include: [
          { model: User },
          { model: Reply },
          { model: Like }
        ]
      })
      if (!tweets) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: 'Tweets不存在'
        })
      }
      tweets = await tweets.map(tweet => tweet.toJSON())
      tweets = tweets.map(tweet => {
        return {
          ...tweet,
          description: tweet.description.substring(0, 50) + '...',
          repliedCounts: tweet.Replies.length,
          likesCounts: tweet.Likes.length
        }
      })
      return res.status(StatusCodes.OK).json({ status: 'success', tweets })
    } catch (error) {
      next(error)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: 'Tweet不存在'
        })
      }
      await tweet.destroy()
      return res.status(StatusCodes.OK).json({ status: 'success', tweet })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
