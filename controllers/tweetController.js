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

  // TODO: fix replyCount 忘記做increment的問題
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

        return Reply.create({
          UserId,
          TweetId,
          comment
        }).then(reply => {
          return res.status(200).json({
            id: reply.id,
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
        exclude: ['updatedAt', 'UserId'],
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
      attributes: {
        exclude: ['updatedAt', 'UserId'],
      },
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

    return Tweet.findByPk(TweetId)
      .then(tweet => {
        if (!tweet) {
          return res.status(400).json({
            status: 'error',
            message: 'Tweet does not exist'
          })
        }
        return tweet.increment('likeCount')
          .then(tweet => {
            return Like.create({ UserId, TweetId })
          })
          .then(like => {
            return res.status(200).json({
              status: 'success',
              message: 'Like successfully',
              tweetId: like.TweetId
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
      return Promise.all([
        like.destroy(),
        like.Tweet.decrement('likeCount')
      ])
    }).then(result => {
      return res.status(200).json({
        status: 'success',
        message: 'Unlike successfully',
        tweetId: result[1].id
      })
    })
  }
}



module.exports = tweetController