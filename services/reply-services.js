const { User, Tweet, Reply } = require('../models')
const { getUser } = require('../_helpers')

const replyServices = {
  getReplies: (req, cb) => {
    const TweetId = req.params.tweet_id
    Reply.findAll({
      where: { TweetId },
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']]
    })
      .then(replies => cb(null, { replies }))
      .catch(err => cb(err))
  },
  postReply: (req, cb) => {
    const UserId = getUser(req).id
    const TweetId = req.params.tweet_id
    const { comment } = req.body
    Promise.all([
      Tweet.findByPk(TweetId),
      User.findByPk(UserId)
    ]).then(([tweet, user]) => {
      if (!tweet) throw new Error('推文不存在！')
      if (!user) throw new Error('用戶不存在！')
      if (!comment) throw new Error('內容不可空白')
      return Reply.create({ comment, UserId, TweetId })
    })
      .then(newReply => cb(null, { reply: newReply }))
      .catch(err => cb(err))
  }
}

module.exports = replyServices
