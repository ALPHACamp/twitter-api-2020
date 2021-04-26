const { catchError } = require('../utils/errorHandling')
const validator = require('validator')
const db = require('../models')
const Reply = db.Reply
const Tweet = db.Tweet
const User = db.User

module.exports = {
  getReplies: (req, res) => {
    Reply.findAll({
      where: { TweetId: req.params.tweetId },
      order: [['createdAt', 'DESC']],
      include: { model: User, attributes: { exclude: ['password'] } }
    })
      .then(replies => {
        if (!replies.length) {
          return res.status(400).json({
            status: 'error', message: 'Reply doesn\'t exist'
          })
        }
        return res.status(200).json(replies)
      })
      .catch(error => {
        catchError(res, error)
      })
  },

  postReply: (req, res) => {
    const { comment } = req.body
    const { tweetId } = req.params

    Tweet.findOne({ where: { id: tweetId } })
      .then(tweet => {
        if (!tweet) {
          return res.status(400).json({ status: 'error', message: 'Tweet doesn\'t exist' })
        }

        if (!comment) {
          return res.status(400).json({ status: 'error', message: 'Write the comment before reply' })
        }

        if (comment && !validator.isByteLength(comment, { min: 0, max: 140 })) {
          return res.status(400).json({ status: 'error', message: 'The comment field can have no more than 140 characters' })
        }

        Reply.create({
          TweetId: tweetId,
          UserId: req.user.id,
          comment: comment.trim()
        })
          .then(() => {
            return res.status(200).json({ status: 'success', message: 'Reply tweet successfully' })
          })
          .catch(error => {
            catchError(res, error)
          })
      })
      .catch(error => {
        catchError(res, error)
      })
  }
}
