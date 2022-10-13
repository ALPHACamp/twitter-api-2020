const { Tweet, Like, User, Reply, sequelize } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const tweets = await Tweet.findAll({
        include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        attributes: [
          'id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`EXISTS(SELECT id FROM Likes WHERE Likes.UserId = ${currentUserId} AND Likes.TweetId = Tweet.id)`), 'isLiked']
        ],
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
      return res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },

  getTweet: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const tweetId = Number(req.params.id)
      const tweet = await Tweet.findOne({
        where: { id: tweetId },
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        attributes: ['id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`EXISTS(SELECT id FROM Likes WHERE Likes.UserId = ${currentUserId} AND Likes.TweetId = Tweet.id)`), 'isLiked']
        ],
        raw: true,
        nest: true
      })
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: 'The tweet does not exist.'
        })
      }
      return res.status(200).json(tweet)
    } catch (err) {
      return next(err)
    }
  },

  getTweetReplies: async (req, res, next) => {
    try {
      const tweetId = Number(req.params.tweet_id)
      const [tweet, replies] = await Promise.all([
        Tweet.findByPk(tweetId),
        Reply.findAll({
          where: { TweetId: tweetId },
          attributes: ['id', 'comment', 'createdAt'],
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
            { model: Tweet, attributes: ['id'], include: { model: User, attributes: ['id', 'account'] } }
          ],
          order: [['createdAt', 'DESC']],
          nest: true,
          raw: true
        })
      ])
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: 'The tweet does not exist.'
        })
      }
      return res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },

  addTweetLike: async (req, res, next) => {
    try {
      const TweetId = Number(req.params.id)
      const currentUserId = helpers.getUser(req).id
      const like = await Like.findOrCreate({ where: { TweetId, UserId: currentUserId } })
      // like already exist
      if (like[1] === false) {
        return res.status(422).json({
          status: 'error',
          message: 'You already liked the tweet.'
        })
      }
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },

  deleteTweetLike: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const TweetId = Number(req.params.id)
      const result = await Like.destroy({ where: { TweetId, UserId: currentUserId } })
      // if result = 0, return 404 for not found like
      if (!result) {
        return res.status(404).json({
          status: 'error',
          message: 'You have not liked the tweet or the tweet dose not exist.'
        })
      }
      // if result = 1, return status 200 for success
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },

  addTweet: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const description = req.body.description?.trim()
      if (!description) {
        return res.status(400).json({
          status: 'error',
          message: 'Tweet description is required.'
        })
      }
      if (description.length > 140) {
        return res.status(422).json({
          status: 'error',
          message: 'Tweet description must be less than 140 characters long.'
        })
      }
      await Tweet.create({ UserId: currentUserId, description })
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },

  deleteTweet: async (req, res, next) => {
    try {
      const TweetId = Number(req.params.id)
      const currentUserId = helpers.getUser(req).id
      // delete tweet and it's replies and likes
      const result = await Tweet.destroy({ where: { id: TweetId, UserId: currentUserId } })
      // if result = 0, return 404 for not found tweet
      if (!result) {
        return res.status(404).json({
          status: 'error',
          message: 'User dose not own the tweet or the tweet does not exist.'
        })
      }
      // if result = 1, return status 200 for success
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },

  addTweetReply: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const comment = req.body.comment?.trim()
      const TweetId = req.params.tweet_id
      if (!comment) {
        return res.status(400).json({
          status: 'error',
          message: 'Reply comment is required.'
        })
      }
      if (comment.length > 140) {
        return res.status(422).json({
          status: 'error',
          message: 'Reply comment must be less than 140 characters long.'
        })
      }
      await Reply.create({ comment, UserId: currentUserId, TweetId })
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },

  deleteTweetReply: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const TweetId = Number(req.params.tweet_id)
      const replyId = Number(req.params.reply_id)
      const result = await Reply.destroy({ where: { id: replyId, TweetId, UserId: currentUserId } })
      // if result = 0, return 404 for not found reply
      if (!result) {
        return res.status(404).json({
          status: 'error',
          message: 'User dose not own the reply or the reply does not exist.'
        })
      }
      // if result = 1, return status 200 for success
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
