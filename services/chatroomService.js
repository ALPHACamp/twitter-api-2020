const db = require('../models')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Like = db.Like
const helpers = require('../_helpers')

let chatroomService = {
  getChatroom = (res, res, callback) => {
    res.sendFile(__dirname + '/views/index.html')
  },
  postReply: (req, res, callback) => {
  const currentUser = req.user ? req.user : helpers.getUser(req)
  return Reply.create({
    comment: req.body.reply,
    TweetId: req.params.tweet_id,
    UserId: currentUser.id,
  }).then((reply) => {
    return callback({
      status: "success",
      message: "Reply successfully.",
      TweetId: Number(reply.TweetId),
      replyId: reply.id,
    })
  })
},
}

module.exports = chatroomService