const { Tweet, User, Reply } = require('../models')
const { StatusCodes } = require('http-status-codes')
const helpers = require('../_helpers')

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
      const UserId = helpers.getUser(req).id

      const { description } = req.body
      if (!description.trim()) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          status: 'error',
          message: '內容不可空白'
        })
      }
      if (description.length > 140) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
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
        message: '成功建立一則tweet'
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
  },
  getReply: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const userId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(tweetId, {
        include: { model: User }
      })
      if (!tweet) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: 'Tweets不存在'
        })
      }
      const reply = await Reply.findAll({
        where: { UserId: userId },
        include: [
          { model: Tweet, include: User }
        ],
        order: [[Tweet, 'createdAt', 'DESC']]
      })
      return res.status(StatusCodes.OK).json(reply)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
