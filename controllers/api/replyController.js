const db = require('../../models')
const Reply = db.Reply
const User = db.User
const defaultLimit = 10

let replyController = {
  getReplies: (req, res) => {
    const options = {
      limit: req.query.limit || defaultLimit,
      offset: req.query.offset || 0,
      where: {
        TweetId: req.params.tweetId,
      },
      attributes: ['id', 'comment', 'createdAt'],
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
      ],
    }
    Reply.findAll(options)
      .then((replies) => res.status(200).json(replies))
      .catch(() => res.status(404).json({ status: 'error', message: '' }))
  },
}

module.exports = replyController
