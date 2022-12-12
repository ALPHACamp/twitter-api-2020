const { Tweet, User, Reply, sequelize } = require('../models')
const helpers = require('../_helpers')
const { relativeTime } = require('../helpers/tweet-helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const tweets = await Tweet.findAll({
        raw: true,
        nest: true,
        include: {
          model: User,
          attributes: ['id', 'avatar', 'account', 'name']
        },
        attributes: [
          'id',
          'createdAt',
          'description',
          [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.UserId = ${currentUserId} AND Likes.TweetId = Tweet.id)`), 'isLiked']
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
      const currentUserId = helpers.getUser(req).id
      const tweet = await Tweet.findByPk(req.params.id, {
        include: [{
          model: User,
          attributes: ['id', 'avatar', 'account', 'name']
        }, {
          model: Reply,
          attributes: ['id', 'comment', 'createdAt'],
          include: {
            model: User,
            attributes: ['id', 'avatar', 'account', 'name']
          },
          where: Reply.TweetId = Tweet.id
        }],
        attributes: [
          'id',
          'createdAt',
          'description',
          // 111111111111111111111111111
          [sequelize.literal('(SELECT COUNT(id) FROM Replies WHERE Replies.TweetId = Tweet.id)'), 'replyCount'],
          [sequelize.literal('(SELECT COUNT(id) FROM Likes WHERE Likes.TweetId = Tweet.id)'), 'likeCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Likes WHERE Likes.UserId = ${currentUserId} AND Likes.TweetId = Tweet.id)`), 'isLiked']
        ],
        order: [['createdAt', 'DESC']]
      })
      const data = tweet.toJSON()
      data.createdAt = relativeTime(data.createdAt)
      data.replyCountttt = data.Replies.length // 2222222222222222222222222 哪個效能比較好
      console.log(2222222, data.createdAt) // ........................

      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const description = req.body.description.trim()
      if (!description) {
        return res.status(400).json({
          status: 'error',
          message: 'Tweet description is required!'
        })
      }
      if (description.length > 140) {
        return res.status(400).json({
          status: 'error',
          message: 'Tweet description can\'t exceed 140 characters!'
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
  getTweetReplies: async (req, res, next) => {
    // const repliedTweetId = req.params.id
    try {
      const replies = await Reply.findAll({
        raw: true,
        nest: true,
        attributes: ['id', 'comment', 'createdAt'],
        include: {
          model: User,
          attributes: ['id', 'avatar', 'account', 'name']
        },
        where: { TweetId: req.params.id }
      })

      return res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController

// POST	/api/tweets/:id/like	喜歡某則tweet
// POST	/api/tweets/:id/unlike	取消喜歡某則tweet
// POST	/api/tweets/:id/replies	新增回覆
