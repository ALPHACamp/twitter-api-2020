const db = require('../models')
const Reply = db.Reply
const Tweet = db.Tweet
const User = db.User

const replyController = {
  postReply: (req, res) => {
    const { comment } = req.body

    if (comment.trim().length === 0) {
      return res.json({ status: 'error', message: '內容不可為空白' })
    }
    if (comment.trim().length > 140) {
      return res.json({ status: 'error', message: '內容不可超過 140 個字元' })
    }

    return Reply.create({
      comment: comment,
      TweetId: req.params.tweet_id,
      UserId: req.user.id
    })
      .then(reply => {
        res.json({ status: 'success', message: '成功建立回覆' })
      })
      .catch(err => {
        console.log(err)
        res.json({ status: 'error', message: `${err}` })
      })
  },

  getReplies: (req, res) => {
    return Reply.findAll({
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      where: { TweetId: req.params.tweet_id },
      include: [User]
    })
      .then(replies => {
        // console.log('=== single reply ===', replies[0])
        if (replies.length === 0) {
          return res.json({ status: 'success', message: '推文不存在或沒有任何回覆', data: replies })
        } else {
          return res.json({ status: 'success', message: '取回推文的所有回覆', data: replies })
        }
      })
      .catch(err => {
        console.log(err)
        res.json({ status: 'error', message: `${err}` })
      })
  },

  deleteReply: (req, res) => {
    return Reply.findByPk(req.params.reply_id, { include: [Tweet] })
      .then(reply => {
        console.log('=== reply ===', reply.toJSON())
        const userId = Number(req.user.id)
        const data = reply.toJSON()

        // 如果使用者 = tweet 作者 => 刪除
        // 如果使用者 = reply 作者 => 刪除
        if (userId === data.UserId || userId === data.Tweet.UserId) {
          return reply.destroy()
            .then(reply => {
              console.log('回覆已刪除')
              return res.json({ status: 'success', message: '回覆已刪除' })
            })
        } else {
          console.log('沒有權限刪除此回覆')
          return res.json({ status: 'error', message: '沒有權限刪除此回覆' })
        }
      })
      .catch(err => {
        console.log(err)
        res.json({ status: 'error', message: `${err}` })
      })
  },



}


module.exports = replyController
