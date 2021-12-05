const db = require('../../models')
const Tweet = db.Tweet
const Reply = db.Reply
const helper = require('../../_helpers')

const replyController = {
  postReply: async (req, res) => {
    try {
      const reply = await Reply.create({
        UserId: helper.getUser(req).id,
        TweetId: req.params.id,
        comment: req.body.comment
      })
      return res.status(200).json(reply)
    } catch (err) {
      console.log(err)
      return res.status(401).json({ status: 'error', message: err })
    }
  },
  getReply: async (req, res) => {
    try {
      const replies = await Reply.findAll({
        where: { TweetId: req.params.id },
        raw: true,
        nest: true
      })
      return res.status(200).json(replies)
    } catch (err) {
      console.log(err)
      return res.status(401).json({ status: 'error', message: err })
    }
  },
  deleteReply: async (req, res) => {
    try {
      const reply = await Reply.findByPk(req.params.replyId)
      if (reply.UserId !== helper.getUser(req).id) {
        return res.status(401).json({ status: 401, message: '無權刪除回覆' })
      }
      await reply.destroy()
      return res.json({ status: 200, message: '刪除成功！' })
    } catch (err) {
      console.log(err)
      return res.status(401).json({ status: 'error', message: err })
    }
  }
}

module.exports = replyController
