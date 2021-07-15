const db = require('../models')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Like = db.Like

const { Op, Sequelize } = require('sequelize')

const tweetService = require('../services/tweetService')

const tweetController = {
  postTweet: async (req, res) => {
    const { description } = req.body
    const viewerId = req.user.id

    try {
      const data = await tweetService.postTweet(viewerId, description)

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  postReply: async (req, res) => {
    const { comment } = req.body
    const TweetId = req.params.id
    const viewerId = req.user.id

    try {
      const data = await tweetService.postReply(viewerId, TweetId, comment)

      return res.status(200).json(data)

    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  getSingleTweet: async (req, res) => {
    const tweet_id = req.params.id
    const viewerId = req.user.id

    try {
      const data = await tweetService.getSingleTweet(viewerId, tweet_id)

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  getTweets: async (req, res) => {
    const viewerId = req.user.id
    try {
      const data = await tweetService.getTweets(viewerId, 'user')

      return res.status(200).json(data)

    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  postLike: async (req, res) => {
    const viewerId = req.user.id
    const TweetId = req.params.id

    try {
      const data = await tweetService.postLike(viewerId, TweetId)

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }  
  },

  postUnlike: (req, res) => {
    const UserId = req.user.id
    const TweetId = req.params.id

    return Like.findOne({
      where: {
        [Op.and]: [
          { UserId },
          { TweetId }
        ]
      },
      include: {
        model: Tweet
      }
    }).then(like => {
      if (!like) {
        return res.status(400).json({
          status: 'error',
          message: 'User did not like this tweet before'
        })
      } else {
        return Promise.all([
          like.destroy(),
          like.Tweet.decrement('likeCount')
        ]).then(result => {
          return res.status(200).json({
            status: 'success',
            message: 'Unlike successfully',
            tweetId: result[1].id
          })
        })
      }
    })
  },

  getTweetReplies: (req, res) => {
    const TweetId = req.params.id

    return Tweet.findByPk(TweetId, {
      attributes: [],
      nest: true,
      include: [
        {
          model: Reply,
          attributes: ['id', 'comment', 'createdAt'],
          nest: true,
          include: [
            {
              model: User,
              nest: true,
              attributes: ['id', 'name', 'account', 'avatar']
            }
          ],
          required: false
        }
      ]
    }).then(tweetWithReplies => {
      if (!tweetWithReplies) {
        return res.status(400).json({
          status: 'error',
          message: 'Tweet does not exist'
        })
      }
      return res.status(200).json(tweetWithReplies.Replies)
    })
  }
}

module.exports = tweetController
