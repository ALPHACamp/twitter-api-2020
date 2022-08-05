const { Tweet, User, Reply, Like } = require('../models')
const { StatusCodes } = require('http-status-codes')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      let tweets = await Tweet.findAll({
        attributes: { exclude: ['updatedAt'] },
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
          { model: Like, attributes: ['id'] },
          { model: Reply, attributes: ['id'] }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!tweets) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: 'Tweets不存在'
        })
      }
      tweets = await tweets.map(tweet => tweet.toJSON())
      tweets = tweets.map(tweet => {
        const repliedCounts = tweet.Replies.length
        const likesCounts = tweet.Likes.length
        delete tweet.Replies
        delete tweet.Likes
        return {
          ...tweet,
          description: tweet.description,
          repliedCounts,
          likesCounts,
          isBeingLiked: req.user.LikedTweets ? req.user.LikedTweets.some(l => l.id === tweet.id) : false
        }
      })
      for (const tweet of tweets) {
        if (tweet.likesCounts < 0) {
          return res.status(StatusCodes.NOT_ACCEPTABLE).json({
            status: 'error',
            message: 'like 錯誤'
          })
        }
        if (tweet.repliedCounts < 0) {
          return res.status(StatusCodes.NOT_ACCEPTABLE).json({
            status: 'error',
            message: 'reply 錯誤'
          })
        }
      }
      return res.status(StatusCodes.OK).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  createTweet: async (req, res, next) => {
    try {
      const UserId = Number(helpers.getUser(req).id)

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
      let tweet = await Tweet.findByPk(req.params.id, {
        attributes: { exclude: ['updatedAt'] },
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
          { model: Like, attributes: ['id'] },
          { model: Reply, attributes: ['id'] }],
        order: [['createdAt', 'DESC']]
      })
      if (!tweet) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: '沒有此則tweet'
        })
      }
      tweet = await tweet.toJSON()
      tweet.repliedCounts = tweet.Replies.length
      tweet.likesCounts = tweet.Likes.length
      delete tweet.Replies
      delete tweet.Likes
      if (tweet.likesCounts < 0) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          status: 'error',
          message: 'like 錯誤'
        })
      }
      if (tweet.repliedCounts < 0) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          status: 'error',
          message: 'reply 錯誤'
        })
      }
      tweet.isBeingLiked = req.user.LikedTweets ? req.user && req.user.LikedTweets.some(l => l.id === tweet.id) : false
      return res.status(StatusCodes.OK).json(tweet)
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: 'Tweet不存在'
        })
      }
      const replies = await Reply.findAll({
        where: { TweetId: tweetId },
        attributes: { exclude: ['updatedAt'] },
        include: [
          { model: User, attributes: ['account', 'avatar', 'name'] },
          {
            model: Tweet,
            attributes: { exclude: ['updatedAt'] },
            include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }]
          }
        ],
        order: [['createdAt', 'DESC']]
      })
      return res.status(StatusCodes.OK).json(replies)
    } catch (err) {
      next(err)
    }
  },
  addLike: async (req, res, next) => {
    try {
      const tweetId = Number(req.params.id)
      const userId = Number(helpers.getUser(req).id)
      const tweet = await Tweet.findByPk(tweetId)
      const user = await User.findByPk(userId)
      if (!tweet || !user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: 'Tweet或user不存在'
        })
      }
      const like = await Like.findOne({
        where: { UserId: userId, TweetId: tweetId }
      })
      if (like) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          status: 'error',
          message: '已對此則tweet按like'
        })
      }

      const data = await Like.create({
        UserId: userId,
        TweetId: tweetId
      })
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: '成功對tweet按like',
        data
      })
    } catch (err) {
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const tweetId = Number(req.params.id)
      const userId = Number(helpers.getUser(req).id)
      const tweet = await Tweet.findByPk(tweetId)
      const user = await User.findByPk(userId)
      if (!tweet || !user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: 'Tweet或user不存在'
        })
      }
      const like = await Like.findOne({
        where: { UserId: userId, TweetId: tweetId }
      })
      if (!like) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          status: 'error',
          message: '還未對此則tweet按like'
        })
      }
      await like.destroy()
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: '成功取消tweet按like'
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = tweetController
