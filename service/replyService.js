const db = require('../models')
const Reply = db.Reply
const helpers = require('../_helpers')

let replyService = {
  postReply: (req, res, callback) => {
    return Reply.create({
      comment: req.body.text,
      TweetId: req.body.tweetId,
      UserId: helpers.getUser(req).id
    }).then(console.log(req.body))////////
      .then((reply) => {
        console.log('reply', reply)
        return callback({
          status: 'success',
          message: 'created new reply successfully',
          TweetId: reply.TweetId,
          replyId: reply.id
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