const helpers = require('../_helpers')

const db = require('../models')
const Reply = db.Reply

const replyController = {
  addReply: (req, res) => {
    if (req.body.comment.length > 200) {
      return res.json({ status: 'error', message: '字數最多 200 字' })
    }
    if (!req.body.comment) {
      return res.json({ status: 'error', message: '內容不可空白' })
    }
    return Reply.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweet_id,
      comment: req.body.comment
    }).then(() => {
      res.json({ status: 'success', message: '成功新增回覆' })
    })
      .catch(error => console.log('error'))
  },

  getReplies: (req, res) => {
    return Reply.findAll({
      where: { TweetId: req.params.tweet_id }
    })
      .then(Replies => {
        return res.json(Replies)
      })
  }
}
module.exports = replyController