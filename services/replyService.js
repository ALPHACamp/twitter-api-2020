const db = require('../models')
const Reply = db.Reply
const helpers = require('../_helpers')

let replyService = {
  postReply: (req, res, callback) => {
    const currentUser = req.user ? req.user : helpers.getUser(req);
    // return Reply.create({
    //   comment: req.body.text,
    //   TweetId: req.body.tweetId,
    //   UserId: helpers.getUser(req).id
    // }).then(console.log(req.body))
    return Reply.create({
      comment: req.body.reply,
      TweetId: req.params.tweet_id,
      UserId: currentUser.id,
    }).then((reply) => {
      console.log("reply", reply);
      return callback({
        status: "success",
        message: "created new reply successfully",
        TweetId: Number(reply.TweetId),
        replyId: reply.id,
      })
    })
  },
  getReplies: (req, res, callback) => {
    const tweetId = req.params.id
    return Reply.findAll({ where: { tweetId: tweetId } })
      .then(results =>
        callback({
          results: results,
        })
      )
  }
}

module.exports = replyService