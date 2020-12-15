const db = require('../../models')
const Reply = db.Reply

const replyController = {
  getReplies: async (req, res) => {
    try {
      const TweetId = req.params.tweet_id
      const replies = await Reply.findAll({ where: { TweetId } })
      return res.json({ replies })
    } catch (error) {
      console.log(error)
    }
  },
  addReply: (req, res) => {

  },
  updateReply: (req, res) => {

  },
  removeReply: (req, res) => {

  }
}

module.exports = replyController
