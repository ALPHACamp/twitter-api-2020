const db = require('../models')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Like = db.Like

const { Op, Sequelize } = require('sequelize')

const tweetController = {
  postTweet: (req, res) => {
    const { description } = req.body
    if (!description) {
      return res.status(400).json({
        status: 'error',
        message: 'Description can not be null'
      })
    } else if (description.length > 140) {
      return res.status(400).json({
        status: 'error',
        message: 'Description can not be longer than 140'
      })
    } else {
      return Tweet.create({
        UserId: req.user.id,
        description,
        replyCount: 0,
        likeCount: 0
      }).then(tweet => {
        return res.status(200).json({
          id: tweet.id,
          status: 'success',
          message: 'Create tweet successfully'
        })
      })
    }
  },

  postReply: (req, res) => {
    const { comment } = req.body
    const TweetId = req.params.id
    const UserId = req.user.id

    if (!comment) {
      return res.status(400).json({
        status: 'error',
        message: 'Comment can not be null'
      })
    }

    return Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) {
          return res.status(400).json({
            status: 'error',
            message: 'Tweet does not exist'
          })
        }
        return Promise.all([
          Reply.create({ UserId, TweetId, comment }),
          tweet.increment('replyCount')
        ]).then(result => {
          return res.status(200).json({
            id: result[0].id,
            status: 'success',
            message: 'Reply has been created successfully'
          })
        })
      })
  },

  getSingleTweet: (req, res) => {
    const tweet_id = req.params.id
    const user_id = req.user.id

    return Tweet.findByPk(tweet_id, {
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        },
        {
          model: Like,
          required: false,
          where: {
            UserId: user_id
          }
        }
      ],
      attributes: {
        exclude: ['updatedAt', 'UserId']
      }
    }).then(tweet => {
      if (!tweet) {
        return res.status(400).json({
          status: 'error',
          message: 'Tweet does not exist'
        })
      }

      tweet = tweet.toJSON()
      tweet.isLike = Boolean(tweet.Likes[0])
      delete tweet.Likes

      return res.status(200).json(tweet)
    })
  },

  getTweets: (req, res) => {
    const user_id = req.user.id

    return Tweet.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        },
        {
          model: Like,
          required: false,
          where: {
            UserId: user_id
          }
        }
      ],
      order: [['createdAt', 'DESC']],
      attributes: [['id', 'TweetId'], 'description', 'likeCount', 'replyCount', 'createdAt'],
      raw: true,
      nest: true
    }).then(tweets => {
      tweets = tweets.map((tweet, i) => {
        const final = {
          ...tweet,
          isLike: Boolean(tweet.Likes.id)
        }

        delete final.Likes

        return final
      })

      return res.status(200).json(tweets)
    })
  },

  postLike: (req, res) => {
    const UserId = req.user.id
    const TweetId = req.params.id

    return Tweet.findByPk(TweetId, {
      include: {
        required: false,
        model: Like,
        where: { UserId }
      }
    }).then(tweet => {
      if (!tweet) {
        return res.status(400).json({
          status: 'error',
          message: 'Tweet does not exist'
        })
      }

      if (tweet.Likes[0]) {
        return res.status(400).json({
          status: 'error',
          message: 'User had liked this tweet before'
        })
      }

      return Promise.all([
        tweet.increment('likeCount'),
        Like.create({ UserId, TweetId })
      ]).then(result => {
        return res.status(200).json({
          status: 'success',
          message: 'Like successfully',
          tweetId: result[1].TweetId
        })
      })
    })
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
