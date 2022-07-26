const { Tweet, Reply } = require('../models')
const { StatusCodes } = require('http-status-codes')
const helper = require('../_helpers')

const replyController = {
  postReply: async (req, res, next) => {
    try {
      const { comment } = req.body
      const TweetId = req.params.id
      const UserId = Number(helper.getUser(req).id)

      if (!comment) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          status: 'error',
          message: '內容不可空白'
        })
      }
      if (comment.length > 140) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({
          status: 'error',
          message: '字數需小於140字'
        })
      }

      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) {
        return res.status(StatusCodes.NOT_FOUND).json({
          status: 'error',
          message: '要回覆的tweet不存在'
        })
      }
      const reply = await Reply.create({
        UserId,
        TweetId,
        comment
      })
      return res.status(StatusCodes.OK).json({ message: '回覆已成功送出！', reply })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = replyController
