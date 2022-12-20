const { User, Tweet, Like, Reply, sequelize } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const currentUserId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(tweetId, {
        nest: true,
        raw: true,
        include:
          { model: User, attributes: ['id', 'account', 'name', 'avatar', 'cover'] },
        attributes: [
          'id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'tweetCount'],
          [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.tweet_id = Tweet.id AND Likes.user_id = ${currentUserId})`), 'isLiked']
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!tweet) {
        return res.status(404).json({
          status: '404',
          message: 'Tweet did not exist!'
        })
      }
      return res.status(200).json(tweet)
    } catch (err) { next(err) }
  },
  getTweetReplies: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) {
        return res.status(404).json({
          status: '404',
          message: 'Tweet did not exist!'
        })
      }
      const replyList = await Reply.findAll({
        raw: true,
        nest: true,
        include: {
          model: User,
          attributes: ['id', 'account', 'name', 'avatar', 'cover']
        },
        where: { TweetId: tweetId },
        order: [['createdAt', 'DESC']]
      })
      res.status(200).json(replyList)
    } catch (err) { next(err) }
  },
  postTweetReply: (req, res, next) => {
    const { comment } = req.body
    const tweetId = req.params.id
    const currentUserId = helpers.getUser(req).id
    const tweet = Tweet.findByPk(tweetId)
    if (!tweet) {
      return res.status(404).json({
        status: '404',
        message: 'Tweet did not exist!'
      })
    }
    if (!comment) {
      return res.status(404).json({
        status: '406',
        message: 'Content is required!'
      })
    }
    if (comment.length > 140) {
      return res.status(401).json({
        status: '406',
        message: 'Too many words!'
      })
    }
    Reply.create({
      UserId: currentUserId,
      TweetId: tweetId,
      comment
    })
      .then(reply => {
        res.status(200).json(reply)
      })
      .catch(err => next(err))
  },
  getTweets: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const tweets = await Tweet.findAll({
        nest: true,
        raw: true,
        include: {
          model: User,
          attributes: ['id', 'account', 'name', 'avatar', 'cover']
        },
        attributes: [
          'id', 'description', 'createdAt',
          [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.tweet_id = Tweet.id AND Likes.user_id = ${currentUserId})`), 'isLiked']
        ],
        order: [['createdAt', 'DESC']]
      })
      return res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  postTweets: (req, res, next) => {
    const currentUserId = helpers.getUser(req).id
    const { description } = req.body
    if (!description) {
      return res.status(406).json({
        status: '406',
        message: 'Content is required!'
      })
    }
    if (description.length > 140) {
      return res.status(401).json({
        status: '406',
        message: 'Too many words!'
      })
    }
    Tweet.create({
      UserId: currentUserId,
      description
    })
      .then(tweet => {
        res.status(200).json(tweet)
      })
      .catch(err => next(err))
  },
  likeTweet: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const UserId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        return res.status(404).json({
          status: '404',
          message: 'Tweet did not exist!'
        })
      }
      const like = await Like.findOne({
        where: { UserId, TweetId }
      })
      if (like) {
        return res.status(401).json({
          status: '406',
          message: 'You have already liked this tweet!'
        })
      }
      const likeRecord = await Like.create({ UserId, TweetId })
      return res.status(200).json(likeRecord)
    } catch (err) {
      next(err)
    }
  },
  unlikeTweet: async (req, res, next) => {
    try {
      const TweetId = req.params.id
      const UserId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        return res.status(404).json({
          status: '404',
          message: 'Tweet did not exist!'
        })
      }
      const like = await Like.findOne({
        where: { UserId, TweetId }
      })
      if (!like) {
        return res.status(406).json({
          status: '406',
          message: 'You have not liked this tweet!'
        })
      }
      await like.destroy()
      return res.status(200).json(like)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController