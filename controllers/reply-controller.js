const { Reply, Tweet } = require('../models')
const helpers = require('../_helpers')

const replyController = {
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
