const { Reply, Tweet } = require('../models')

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
  // postReply: (req, res, next) => {

  // }
}

module.exports = replyController