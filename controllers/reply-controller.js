const { Reply, Tweet, User } = require('../models')
const { relativeTimeFromNow } = require('../helpers/dayjs-helpers')
const helpers = require('../_helpers')

const replyController = {
  getTweetReplies: async (req, res, next) => {
    try {
      const TweetId = req.params.tweetId
      const replies = await Reply.findAll({
        where: { TweetId },
        include: [
          { model: User, attributes: ['id', 'account', 'name', 'avatar'] }
        ],
        order: [['createdAt', 'DESC']]
      })

      const tweet = await Tweet.findByPk(TweetId, {
        include: [
          { model: User, attributes: ['account'] } // 可得知回覆的推文是誰的
        ]
      })
      if (!tweet) throw new Error('推文不存在！')
      if (!replies.length) {
        return res.status(200).json({
          status: 'success',
          message: '此篇推文目前沒有回覆。'
        })
      }

      const data = replies.map(reply => ({
        ...reply.toJSON(),
        createdAt: relativeTimeFromNow(reply.createdAt),
        tweet
      }))

      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  },
  postReply: async (req, res, next) => {
    try {
      const { comment } = req.body
      const TweetId = req.params.tweetId

      if (!comment) throw new Error('回覆內容不可空白！')
      if (comment.length > 140) throw new Error('回覆字數不可超過140字！')

      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new Error('你想回覆的推文不存在！')

      const reply = await Reply.create({
        comment,
        TweetId,
        UserId: helpers.getUser(req).id
      })

      return res.status(200).json({
        status: 'success',
        message: '成功發佈回覆！',
        reply
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = replyController
