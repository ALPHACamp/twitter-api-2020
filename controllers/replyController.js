const helpers = require('../_helpers')
const db = require('../models')
const Reply = db.Reply

const replyController = {
  postReply: async (req, res) => {
    await Reply.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweet_id,
      comment: req.body.comment
    })
    const data = { status: 'success', message: 'a new comment was successfully replied' }
    return res.json(data)
  }
}

module.exports = replyController
