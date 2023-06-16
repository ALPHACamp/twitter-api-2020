const { Tweet, User, Reply } = require('../models')
const Sequelize = require('sequelize')
const { literal } = Sequelize
const moment = require('moment')

const replyController = {
  postComment: (req, res, next) => {
    const tweetId = req.params.tweet_id
    return Tweet.findByPk(tweetId, {
      include: [Reply]
    }).then(tweet => {
      const { comment } = req.body
      const userId = req.user.id
      if (!comment) throw new Error('Comment text is required!')
      if (!tweet) throw new Error("Tweet didn't exist!")
      return Reply.create({
        userId,
        tweetId,
        comment
      })
    }).then(reply => res.status(200).json(reply))
      .catch(err => next(err))
  },
  getComment: (req, res, next) => {
    const tweetId = req.params.tweet_id
    return Reply.findAll({
      include: [User],
      where: { tweetId },
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['UserId', 'TweetId'],
      },
      nest: true,
      raw: true
    })
      .then((replies) => {
        if (!replies.length) throw new Error("Replies didn't exists!")
        res.status(200).json(replies)
      })
      .catch(err => next(err))
  },
  editComment: (req, res, next) => {
    const replyId = req.params.reply_id
    const userId = req.user.id
    return Reply.findByPk(replyId, {
      raw: true,
      nest: true,
      attributes: {
        exclude: ['UserId', 'TweetId'],
      },
    })
      .then(reply => {
        if (!reply) throw new Error("Reply didn't exist!")
        if (reply.userId !== userId) {
          throw new Error('You are not authorized to edit this reply!')
        }
        return res.status(200).json(reply)
      })
      .catch(err => next(err))
  },
  putComment: (req, res, next) => {
    const replyId = req.params.reply_id
    const userId = req.user.id
    return Reply.findByPk(replyId)
      .then(reply => {
        if (!reply) {
          throw new Error('Reply not found!')
        }
        if (reply.userId !== userId) {
          throw new Error('You are not authorized to edit this reply!')
        }
        if (!req.body.comment) throw new Error('Comment text is required!')

        return reply.update({
          comment: req.body.comment
        })
      })
      .then(updatedReply => {
        res.status(200).json(updatedReply)
      })
      .catch(err => next(err))
  },
  deletedComment: (req, res, next) => {
    const replyId = req.params.reply_id
    const userId = req.user.id
    return Reply.findByPk(replyId)
      .then(reply => {
        if (!reply) {
          throw new Error('Reply not found!')
        }
        if (reply.userId !== userId) {
          throw new Error('You are not authorized to delete this reply!')
        }

        return reply.destroy()
      })
      .then(deletedReply => {
        res.status(200).json(deletedReply)
      })
      .catch(err => next(err))
  }
}

module.exports = replyController