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
      TweetId: req.body.tweet_id,
      UserId: req.user.id
    })
      .then(reply => {
        res.json({ status: 'success', message: '成功建立回覆' })
      })
      .catch(err => {
        console.log(err)
        res.json({ status: 'error', message: `${err}` })
      })
  }
}

module.exports = replyController
