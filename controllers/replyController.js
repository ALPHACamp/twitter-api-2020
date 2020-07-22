const db = require('../models')
const Reply = db.Reply

let restController = {
  postReply: (req, res) => {
    if (!req.body.text) {
      return res.json({ status: 'error', message: "貼文不能為空白" })
    } else {
      return Reply.create({
        comment: req.body.text,
        TweetId: req.body.tweetId,
        // UserId: req.user.id
      })
        .then((tweet) => {
          return res.json({ status: 'success', message: '回覆成功' })
        })
    }
  },
}
module.exports = restController