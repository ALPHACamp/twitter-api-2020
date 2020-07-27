const db = require('../models')
const Reply = db.Reply
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const helpers = require('../_helpers')

let replyController = {
  postReply: (req, res) => {
    if (!req.body.comment) {
      return res.json({ status: 'error', message: "貼文不能為空白" })
    } else {
      return Reply.create({
        comment: req.body.comment,
        TweetId: req.params.tweet_id,
        UserId: req.user.id
      })
        .then((tweet) => {
          return res.json({ status: 'success', message: '回覆成功' })
        }).catch(err => console.log(err))
    }
  },
  getReplies: (req, res) => {
    return Tweet.findByPk(req.params.tweet_id, {
      order: [[{ model: Reply }, 'createdAt', 'DESC']],
      include: [
        { model: Reply, include: [User] },
      ]
    }).then(tweet => {
      const data = tweet.Replies.map(r => ({
        ...r.dataValues,
        comment: r.comment
      }))
      return res.json(data)
    }).catch(err => console.log(err))
  },
}
module.exports = replyController