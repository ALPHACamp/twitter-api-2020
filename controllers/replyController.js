const { Reply, Tweet } = require('../models')

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
  }
}

module.exports = replyController
