const { User, Tweet, Reply } = require('../models')
const helpers = require('../_helpers')
const { dateFormat } = require('../helpers/date-helper')

const replyController = {
  // 新增推文回覆
  postReply: (req, res, next) => {
    const TweetId = req.params.tweet_id
    const UserId = helpers.getUser(req).id
    const { comment } = req.body
    if (!comment) throw new Error('Comment is required!')
    if (!comment?.trim()) throw new Error('內容不可空白!')
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
        res.json(newReply)
      })
      .catch(err => next(err))
  },
  // 該則推文的所有回覆
  getReplies: (req, res, next) => {
    return Reply.findAll({
      where: { TweetId: req.params.tweet_id },
      include: Tweet
    })
      .then(replies => {
        return replies
          .map(reply => ({
            ...reply.dataValues,
            relativeTime: dateFormat(reply.dataValues.createdAt).fromNow()
          }))
      })
      .then(replies => {
        if (!replies) throw new Error("Reply didn't exist!")
        return res.json(replies)
      })
      .catch(err => next(err))
  }

}

module.exports = replyController
