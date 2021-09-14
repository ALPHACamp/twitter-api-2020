const helpers = require('../_helpers')
const db = require('../models')
const Reply = db.Reply
const User = db.User
const Tweet = db.Tweet

const replyController = {
  postReply: async (req, res) => {
    try {
      await Reply.create({
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweet_id,
        comment: req.body.comment
      })
      const tweet = await Tweet.findByPk(req.params.tweet_id)
      await tweet.increment(['replyCount'], { by: 1 })
      const data = { status: 'success', message: 'a new comment was successfully replied' }
      return res.json(data)
    } catch (err) {
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  },
  getReply: async (req, res) => {
    try {
      const replies = await Reply.findAll({
        where: { TweetId: req.params.tweet_id },
        include: [
          User,
          Tweet
        ]
      })
      return res.json(replies)
    } catch (err) {
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  }
}

module.exports = replyController
