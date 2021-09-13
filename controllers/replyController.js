const helpers = require('../_helpers')
const db = require('../models')
const Reply = db.Reply
const User = db.User
const Tweet = db.Tweet

const replyController = {
  postReply: async (req, res) => {
    await Reply.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweet_id,
      comment: req.body.comment
    })
    const data = { status: 'success', message: 'a new comment was successfully replied' }
    return res.json(data)
  },
  getReply: async (req, res) => {
    const replies = await Reply.findAll({
      where: { TweetId: req.params.tweet_id },
      include: [
        User,
        Tweet
      ]
    })
    return res.json(replies)
  }
}

module.exports = replyController
