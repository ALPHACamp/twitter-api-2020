const { Tweet, Reply, User } = require('../models')
const { StatusCodes } = require('http-status-codes')
const helpers = require('../_helpers')

const replyController = {
  postReply: async (req, res, next) => {
    try {
      const { comment } = req.body
      const TweetId = req.params.id
      const UserId = Number(helpers.getUser(req).id)

      if (!comment.trim()) {
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
      return res.status(StatusCodes.OK).json({
        status: 'success',
        message: '回覆已成功送出！',
        reply
      })
    } catch (err) {
      next(err)
    }
  },
  editReply: async (req, res, next) => {
    const ReplyId = Number(req.params.id)
    const UserId = Number(helpers.getUser(req).id)
    const { comment } = req.body
    const user = await User.findByPk(UserId)
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: 'error',
        message: 'User不存在'
      })
    }
    if (!comment.trim()) {
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
    const reply = await Reply.findByPk(ReplyId)
    if (reply.toJSON().UserId !== UserId) {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: 'error',
        message: '無法編輯他人回覆'
      })
    }
    await reply.update({
      comment
    })
    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: '成功修改回覆'
    })
  }
}

module.exports = replyController
