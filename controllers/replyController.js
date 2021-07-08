const { Reply, Tweet, User } = require('../models')
const moment = require('moment')

const replyController = {
  postReply: async (req, res, next) => {
    try {
      const { comment } = req.body
      if (!comment) return res.json({ status: 'error', message: '回覆內容不能為空白！' })
      if (comment.length > 140) {
        return res.json({ status: 'error', message: '回覆內容上限為140字！' })
      }
      await Reply.create({
        comment,
        UserId: req.user.id,
        TweetId: req.params.tweet_id
      })
      await Tweet.increment('replyCounts', { where: { id: req.params.tweet_id } })
      return res.json({ status: 'success', message: '成功新增回覆內容！' })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const results = await Reply.findAll({
        raw: true,
        nest: true,
        where: { TweetId: req.params.tweet_id },
        attributes: ['id', 'comment', 'createdAt'],
        include: [{
          model: User,
          attributes: ['id', 'name', 'account', 'avatar']
        }],
        order: [
          ['createdAt', 'DESC']
        ]
      })
      const replies = results.map(reply => ({
        ...reply,
        createdAt: moment(reply.createdAt).format('YYYY-MM-DD kk:mm:ss')
      }))
      return res.json(replies)
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = replyController
