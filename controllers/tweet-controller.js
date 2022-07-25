const { Tweet, User } = require('../models')
const { StatusCodes } = require('http-status-codes')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include:
          [{ model: User, as: 'LikedUsers' }]
      })
      if (!tweets) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: 'Tweets不存在'
        })
      }
      return res.status(StatusCodes.OK).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  createTweet: async (req, res, next) => {
    try {
      const { UserId, description } = req.body
      if (!description) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: '內容不可空白'
        })
      }
      if (description.length > 140) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: '字數需小於140字'
        })
      }
      await Tweet.create({
        UserId,
        description
      })
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: '成功創建一則tweet'
      })
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id, {
        include: { model: User, as: 'LikedUsers' }
      })
      if (!tweet) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: '沒有此則tweet'
        })
      }
      return res.status(StatusCodes.OK).json(tweet)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
