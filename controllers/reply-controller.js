const { Reply, Tweet } = require('../models')
const helpers = require('../_helpers')

const replyController = {
  getReplies: (req, res, next) => {
    const getTweetId = Number(req.params.id)
    return Reply.findAll({
      where: { TweetId: getTweetId },
      order: [[ 'createdAt', 'DESC' ]]
    })
      .then(replies => {
        res.status(200).json(replies)
      })
      .catch(err => next(err))
  },
  postReply: (req, res, next) => {
    const getTweetId = Number(req.params.id)
    const UserId = helpers.getUser(req).id
    const { comment } = req.body
    if (!comment) throw new Error('內容不可空白')
    return Tweet.findByPk(getTweetId)
      .then(tweet => {
        if (!tweet) throw new Error('Tweet not exist!')
        return Reply.create({
          comment,
          TweetId: getTweetId,
          UserId
        })
      })
      .then(newReply => {
        res.status(200).json(newReply)
      })
      .catch(err => next(err))
  }
}

module.exports = replyController