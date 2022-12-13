const { User, Tweet, Reply } = require('../models')
const { getUser } = require('../_helpers')

const replyController = {
  postReply: (req, res, next) => {
    const { TweetId, comment } = req.body
    const UserId = getUser(req).id
    if (!comment) throw new Error('Comment is required!')
    return Promise.all([
      User.findByPk(UserId),
      Tweet.findByPk(TweetId)
    ])
      .then(([user, tweet]) => {
        if (!user) throw new Error("User didn't exist!")
        if (!tweet) throw new Error("Tweet didn't exist!")
        return Reply.create({
          comment,
          TweetId,
          UserId
        })
      })
      .then(newReply => {
        res.json({
          status: 'success',
          reply: newReply
        })
      })
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    return res.json('Hello world!')
  }

}

module.exports = replyController
