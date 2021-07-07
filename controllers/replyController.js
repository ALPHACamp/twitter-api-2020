const { Reply, Like } = require('../models')

const replyController = {
  likeReply: async (req, res, next) => {
    try {
      const { ReplyId } = req.params
      const reply = await Reply.findByPk(ReplyId)
      if (!reply) return res.json({ status: 'error', message: '找不到此回覆' })
      const [like, created] = await Like.findOrCreate({
        where: {
          UserId: req.user.id,
          ReplyId
        }
      })
      if (!created) return res.json({ status: 'success', message: '回覆已按過讚' })
      return res.json({ status: 'success', message: '成功按讚回覆' })
    }
    catch (err) {
      next(err)
    }
  },

  unlikeReply: async (req, res, next) => {
    try {
      const like = await Like.findOne({
        where: {
          UserId: req.user.id,
          ReplyId: req.params.ReplyId
        }
      })
      if (!like) return res.json({ status: 'error', message: '此回覆並無按讚紀錄' })
      await like.destroy()
      return res.json({ status: 'success', message: '按讚紀錄已刪除' })
    }
    catch (err) {
      next(err)
    }
  }
}

module.exports = replyController