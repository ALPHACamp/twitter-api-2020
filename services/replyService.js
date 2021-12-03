// 載入所需套件
const { Reply, User } = require('../models')
const helpers = require('../_helpers')

const replyService = {
  postReply: async (req, res, callback) => {
    try {
      const { comment } = req.body

      //確認回覆欄是否有填寫
      if (comment.trim() === '') {
        return callback({ status: 'error', message: '內容不可空白' })
      } else {
        await Reply.create({
          comment,
          TweetId: req.params.tweet_id,
          UserId: helpers.getUser(req).id,
        })
      }
      return callback({ status: 'success', message: '成功回覆貼文' })
    } catch (err) {
      console.log(err)
    }
  },

  getReplies: async (req, res, callback) => {
    try {
      //撈出特定:tweet_id的reply所有資料，並取得關聯User的資料
      const replies = await Reply.findAll({
        where: { TweetId: req.params.tweet_id },
        raw: true,
        nest: true,
        include: [{ model: User, attributes: ['id', 'account', 'name', 'avatar'] }],
      })
      return callback(replies)
    } catch (err) {
      console.log(err)
    }
  }
}


// replyController exports
module.exports = replyService