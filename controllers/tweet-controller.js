const { Tweet, User, sequelize } = require('../models')
const { getUser } = require('../_helpers')
const { relativeTime } = require('../helpers/date-helper')

const tweetController = {
  postTweet: async (req, res, next) => {
    try {
      const message = {}
      const description = req.body.description.trim()
      const { UserId } = getUser(req).id
      if (!description) message.description = '內容不可空白'
      if (description.length > 140) message.description = '內容不可超出140字'
      if (Object.keys(message).length !== 0) {
        return res.status(500).json({
          status: 'error',
          message,
          data: { description } || null
        })
      }
      await Tweet.create({
        UserId,
        description
      })
      return res.status(200).json({ status: 'success' })
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const currentUserId = getUser(req).id
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: {
          model: User,
          attributes: ['id', 'avatar', 'account', 'name']
        },
        attributes: [
          'id',
          'description',
          'createdAt',
          [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likeCount'],
          [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.User_id = ${currentUserId} AND Likes.Tweet_id = Tweet.id)`), 'isLiked']
        ],
        order: [['createdAt', 'DESC']]
      })
      const data = tweets.map(tweet => ({
        ...tweet,
        createdAt: relativeTime(tweet.createdAt)
      }))
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const currentUserId = getUser(req).id
      const tweet = await Tweet.findByPk(req.params.tweet_id, {
        raw: true,
        nest: true,
        include: {
          model: User,
          attributes: ['id', 'avatar', 'account', 'name']
        },
        attributes: [
          'id',
          'description',
          'createdAt',
          [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.Tweet_id = Tweet.id)'), 'likeCount'],
          [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.Tweet_id = Tweet.id)'), 'replyCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.User_id = ${currentUserId} AND Likes.Tweet_id = Tweet.id)`), 'isLiked']
        ]
      })

      if (!tweet) {
        return res.status(500).json({
          status: 'error',
          message: '貼文不存在'
        })
      }

      const data = tweet
      data.createdAt = relativeTime(data.createdAt)
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
