const helpers = require('../../_helpers')
const sequelize = require('sequelize')
const { User, Tweet, Like, Reply } = require('../../models')
const appFunc = require('../../services/appFunctions')

const tweetController = {
  postTweet: async (req, res, next) => {
    const { description } = req.body
    try {
      if (description.length > 140) throw new Error('推文字數不可大於140字！')
      const tweet = await Tweet.create({
        UserId: helpers.getUser(req).id,
        description
      })
      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        res.json({ tweet: tweet.toJSON() })
      }
      res.json({
        status: 'success',
        data: { tweet: tweet.toJSON() }
      })
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: {
          model: User,
          attributes: ['name', 'account', 'avatar']
        },
        attributes: [
          'id',
          'UserId',
          'description',
          'createdAt',
          [sequelize.literal('(select count(TweetId) from Replies where TweetId = Tweet.id)'), 'replyCount']
        ]
      })
      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        res.json(tweets)
      }
      await Promise.all(tweets.map(async tweet => {
        return await appFunc.resTweetHandler(userId, tweet)
      }))
      res.json({
        status: 'success',
        data: { tweets }
      })
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const tweet = await Tweet.findOne({
        where: { id: req.params.id },
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: {
          model: User,
          attributes: ['name', 'account', 'avatar']
        },
        attributes: [
          'id',
          'UserId',
          'description',
          'createdAt',
          [sequelize.literal('(select count(TweetId) from Replies where TweetId = Tweet.id)'), 'replyCount']
        ]
      })
      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        res.json(tweet)
      }
      await appFunc.resTweetHandler(userId, tweet)
      res.json({
        status: 'success',
        data: { tweet }
      })
    } catch (err) {
      next(err)
    }
  },
  addLike: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      const like = await Like.findOne({ where: { UserId, TweetId } })

      if (!tweet) throw new Error("Tweet didn't exist!")
      if (like) throw new Error('You have liked this tweet!')

      await Like.create({ UserId, TweetId })
      return res.json({
        status: 'success',
        data: {
          ...tweet.toJSON(),
          isLiked: true
        }
      })
    } catch (err) {
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      const unliked = await Like.findOne({ where: { UserId, TweetId } })

      if (!tweet) throw new Error("Tweet didn't exist!")
      if (!unliked) throw new Error("You haven't Liked this tweet")

      await unliked.destroy()
      return res.json({
        status: 'success',
        data: {
          ...tweet.toJSON(),
          isLiked: false
        }
      })
    } catch (err) {
      next(err)
    }
  },
  postReply: async (req, res, next) => {
    try {
      const { comment } = req.body
      const TweetId = req.params.id
      const UserId = helpers.getUser(req).id
      if (!comment) throw new Error('Comment text is required!')
      if (comment.length > 140) throw new Error('回應字數不可大於140字！')
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new Error('Tweet is not exist!')
      const reply = await Reply.create({
        TweetId,
        UserId,
        comment
      })
      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        res.json({ reply: reply.toJSON() })
      }
      res.json({
        status: 'success',
        data: { reply: reply.toJSON() }
      })
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new Error('Tweet is not exist!')
      const replies = await Reply.findAll({
        where: { TweetId },
        raw: true,
        nest: true,
        include: [{
          model: Tweet,
          attributes: ['id'],
          include: [{ model: User, attributes: ['account'] }]
        },
        {
          model: User,
          attributes: ['name', 'account', 'avatar']
        }]
      })
      if (process.env.NODE_ENV === 'test') {
        res.json(replies)
      }
      const resReplies = appFunc.resRepliesHandler(replies)
      res.json({
        status: 'success',
        data: { replies: resReplies }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
