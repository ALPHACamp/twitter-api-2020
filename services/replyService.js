// 載入所需套件
const { Reply, User, Tweet } = require('../models')
const helpers = require('../_helpers')

const replyService = {
  postReply: async (req, res, callback) => {
    try {
      const { comment } = req.body

      //確認回覆欄是否有填寫
      if (comment.trim() === '') {
        return callback({ status: 'error', message: '需輸入內文才能回覆' })
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
  }
}



// replyController exports
module.exports = replyService