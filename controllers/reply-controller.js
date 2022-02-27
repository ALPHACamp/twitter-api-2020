const { User, Reply } = require('../models')
const helpers = require('../_helpers')

const replyController = {
  getReplies: (req, res, next) => {
    return Reply.findAll({
      where: { TweetId: req.params.tweet_id },
      include: [{ model: User, attributes: ['name', 'account', 'avatar'] }],
      order: [['createdAt', 'DESC']]
    })
    .then(replies => {
      res.json(replies)
    })
    .catch(err => next(err))
  },
  addReply: (req, res, next) => {
    const { comment } = req.body
    if (!comment) {
      return res.json({ status: 'error', message: '內容不可空白!'})
    }
    if (comment.length > 140) {
      return res.json({ status: 'error', message: '內容不可空白!'})
    }
    return Reply.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweet_id,
      comment: comment
    })
    .then(() => {
      res.json({ status: 'success', message: '成功回覆!'})
    })
    .catch(err => next(err))
  }

}

module.exports = replyController