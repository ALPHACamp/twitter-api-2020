const { Tweet, Reply } = require('../models')

const replyController = {
  postComment: (req, res, next) => {
    const tweetId = req.params.tweet_id
    return Tweet.findByPk(tweetId, {
      include: [Reply]
    }).then(tweet => {
      const { comment } = req.body
      const userId = req.user.id
      if (!comment) throw new Error('Comment text is required!')
      if (!tweet) throw new Error("Tweet didn't exist!")
      return Reply.create({
        userId,
        tweetId,
        comment
      })
    }).then(reply => res.status(200).json(reply))
      .catch(err => next(err))
  },
  getComment: (req, res, next) => {
    const tweetId = req.params.tweet_id
    return Reply.findAll({
    where: { tweetId },
  })
  .then(reply => res.status(200).json(reply))
  .catch(err => next(err))
  }
}  

module.exports = replyController