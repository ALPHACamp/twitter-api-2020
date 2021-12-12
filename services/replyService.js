const db = require('../models')
const Reply = db.Reply
const helpers = require('../_helpers')

let replyService = {
  postReply: (req, res, callback) => {
    return Reply.create({
      comment: req.body.comment,
      TweetId: req.params.tweet_id,
      UserId: helpers.getUser(req).id,
    }).then((reply) => {
      return callback({
        status: "success",
        message: "created new reply successfully",
        TweetId: Number(reply.TweetId),
        replyId: reply.id,
      });
    });
  },
  getReplies: (req, res, callback) => {
    const tweetId = req.params.tweet_id
    return Reply.findAll({ where: { tweetId: tweetId } })
      .then(results => {
        callback(results)
      })
  }
}

module.exports = replyService