const { User, Tweet, Reply } = require('../models')
const { getUser } = require('../_helpers')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
const isYesterday = require('dayjs/plugin/isYesterday')
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw')
dayjs.extend(relativeTime)
dayjs.extend(isYesterday)

const replyController = {
  postReply: (req, res, next) => {
    const TweetId = req.params.id
    const UserId = getUser(req).id
    const { comment } = req.body
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
  // 在回覆中帶入 relativeTime
  getReplies: (req, res, next) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: Reply, include: User }
      ]
    })
      // .then(tweet => {
      //   tweet.Replies
      //     .map(reply => ({
      //       ...reply.dataValues,
      //       relativeTime: dayjs(reply.dataValues.createdAt).fromNow()
      //     }))
      //   return tweet
      // })
      .then(tweet => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        return res.json({
          status: 'success',
          tweetUser: tweet.toJSON().User,
          tweetReplies: tweet.toJSON().Replies
        })
      })
      .catch(err => next(err))
  }

}

module.exports = replyController
