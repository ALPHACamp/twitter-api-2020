const { catchError } = require('../utils/errorHandling')
const db = require('../models')
const Reply = db.Reply
const Tweet = db.Tweet

module.exports = {
  getReplies: (req, res) => {
    Reply.findAll({
      where: { TweetId: req.params.tweetId },
      order: [['createdAt', 'DESC']]
    })
      .then(replies => {
        if (!replies.length) {
          return res.status(400).json({
            status: 'error', message: 'reply doesn\'t exist'
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
          return res.status(400).json({ status: 'error', message: 'Tweet doesn\'t esist' })
        }

        if (!comment) {
          return res.status(400).json({ status: 'error', message: 'Write the comment before reply' })
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
