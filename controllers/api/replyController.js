const helper = require('../../_helpers')
const { Reply, Tweet, User } = require('../../models')

const replyController = {
  getReplies: async (req, res) => {
    try {
      const TweetId = req.params.tweet_id
      const replies = await Reply.findAll({ where: { TweetId } })
      return res.json(replies)
    } catch (error) {
      console.log(error)
    }
  },
  addReply: async (req, res) => {
    try {
      const comment = req.body.comment
      const TweetId = req.params.tweet_id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        return res.json({ status: 'error', message: "This tweet doesn't exist." })
      }
      if (comment.trim() === '') {
        return res.json({ status: 'error', message: "Comment can't be empty." })
      }
      await Reply.create({
        UserId: helper.getUser(req).id,
        TweetId,
        comment
      })
      res.json({ status: 'success', message: 'ok' })
    } catch (error) {
      console.log(error)
    }
  },
  updateReply: async (req, res) => {
    try {
      const comment = req.body.comment
      const TweetId = req.params.tweet_id
      const id = req.params.reply_id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        return res.json({ status: 'error', message: "This tweet doesn't exist." })
      }
      if (comment.trim() === '') {
        return res.json({ status: 'error', message: "Comment can't be empty." })
      }
      const reply = await Reply.findByPk(id)
      if (!reply) {
        return res.json({ status: 'error', message: "This reply doesn't exist." })
      }
      await reply.update({ comment })
      res.json({ status: 'success', message: 'ok' })
    } catch (error) {
      console.log(error)
    }
  },
  removeReply: async (req, res) => {
    try {
      const TweetId = req.params.tweet_id
      const id = req.params.reply_id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        return res.json({ status: 'error', message: "This tweet doesn't exist." })
      }
      const reply = await Reply.findByPk(id)
      if (!reply) {
        return res.json({ status: 'error', message: "This reply doesn't exist." })
      }
      if (reply.UserId !== helper.getUser(req).id) {
        return res.json({ status: 'error', message: 'Permission denied.' })
      }
      await reply.destroy()
      res.json({ status: 'success', message: 'ok' })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = replyController
