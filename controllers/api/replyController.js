const db = require('../../models')
const Reply = db.Reply
const replyService = require('../../services/replyService.js')

let replyController = {
  postReply: (req, res) => {
    // const currentUser = req.user ? req.user : helpers.getUser(req)
    // return Reply.create({
    //   comment: req.body.reply,
    //   TweetId: req.params.tweet_id,
    //   UserId: currentUser.id,
    // }).then((reply) => {
    //   // return res.redirect('/tweets')
    //   req.flash('success_messages', '你己成功留言')
    //   return res.json(reply);
    // });
    replyService.postReply(req, res, (data) => {
      console.log(data)
      return res.json(data)
    })
  },
  getReplies: (req, res) => {
    replyService.getReplies(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = replyController