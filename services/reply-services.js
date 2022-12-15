const { Tweet, Reply, User } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')

const replyServices = {
  getReplies: (req, cb) => {
    // 預設可以再改
    const DEFAULT_LIMIT = 9
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)

    return Reply.findAndCountAll({
      offset,
      order: [['createdAt', 'DESC']],
      nest: true,
      raw: true
    })
      .then(replies => {
        const data = replies.rows
        return cb(null,
          data,
          {
            pagination: getPagination(limit, page, replies.count)
          }
        )
      })
      .catch(err => cb(err))
  },
  postReply: (req, cb) => {
    const TweetId = req.params.tweet_id
    const { comment } = req.body
    const UserId = req.user.id
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
      .then(postedReply => cb(null, { postedReply }))
      .catch(err => cb(err))
  }
}

module.exports = replyServices
