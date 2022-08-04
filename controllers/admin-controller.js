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
            message: '帳號不存在'
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
      users = await users.map(user => {
        return {
          id: user.id,
          avatar: user.avatar,
          name: user.name,
          account: user.account,
          cover: user.cover,
          tweetsCounts: user.Tweets.length,
          likedTweetsCounts: user.Tweets.reduce((prev, next) => prev + next.Likes.length, 0),
          followingsCounts: user.Followings.length,
          followersCounts: user.Followers.length
        }
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
          id: tweet.id,
          idOfUser: tweet.User.id,
          avatarOfUser: tweet.User.avatar,
          nameOfUser: tweet.User.name,
          account: tweet.User.account,
          description: tweet.description.substring(0, 50).length === 50 ? tweet.description.substring(0, 50) + '...' : tweet.description.substring(0, 50),
          createdAt: tweet.createdAt
        }
      })
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: '成功取得tweets',
        tweets
      })
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
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: '成功刪除tweet',
        tweet
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
