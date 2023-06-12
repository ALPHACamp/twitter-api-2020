const { Tweet, Reply } = require('../models')
const { getUser } = require('../_helpers')

const replyServices = {
  postComment: (req, cb) => {
    const tweetId = req.params.tweet_id
    return Tweet.findByPk(tweetId, {
      include: [Reply]
    }).then(tweet => {
      const { comment } = req.body
      const userId = getUser(req).id
      if (!comment) throw new Error('Comment text is required!')
      if (!tweet) throw new Error("Tweet didn't exist!")
      return Reply.create({
        userId,
        tweetId,
        comment
      })
    }).then(reply => cb(null, { reply }))
      .catch(err => cb(err))
  },
  getComment: (req, cb) => {
    const tweetId = req.params.tweet_id
    return Reply.findAll({
    where: { tweetId },
  })
  .then(reply => cb(null, { reply }))
  .catch(err => cb(err))
  }
}

module.exports = replyServices