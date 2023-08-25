const { User, Tweet, Reply } = require('../models')
const helper = require('../_helpers')
const { relativeTimeFormat } = require('../helpers/day-helpers')

const replyServices = {
  getReplies: (req, cb) => {
    const TweetId = req.params.tweet_id
    return Promise.all([
      Tweet.findOne({
        where: { id: TweetId },
        raw: true,
        nest: true,
        include: [{ model: User, attributes: ['name'] }]
      }),
      Reply.findAll({
        where: { TweetId },
        raw: true,
        nest: true,
        include: [
          { model: User, attributes: ['avatar', 'name', 'account'] }
        ],
        order: [['createdAt', 'DESC']]
      })
    ]).then(([tweet, replies]) => {
      if (!tweet) throw new Error('貼文不存在！')
      const data = replies.map(reply => ({
        ...reply,
        createdAt: relativeTimeFormat(reply.createdAt),
        poster: tweet.User.name
      }))
      cb(null, data)
    })
      .catch(err => cb(err))
  },
  postReply: (req, cb) => {
    const UserId = helper.getUser(req).id
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
