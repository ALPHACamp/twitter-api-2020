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
      return res.json(tweets)
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
      // error code 404
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
      const replies = await Reply.findAll({
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
      res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },

  addTweetLike: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const currentUserId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(TweetId, { raw: true })

      // status 404 tweet not exist
      if (!tweet) {
        res.status(404).json({
          status: 'error',
          message: 'The tweet does not exist'
        })
      }
      const like = await Like.findOne({
        where: { TweetId, UserId: currentUserId }
      })

      // status 400 like liked tweets
      if (like) throw new Error('You already liked the tweet')
      await Like.create({ TweetId, UserId: currentUserId })
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },

  deleteTweetLike: async (req, res, next) => {
    try {
      res.send('delete')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
