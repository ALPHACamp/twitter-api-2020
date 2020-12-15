const db = require('../models')
const Reply = db.Reply
const helpers = require('../_helpers')

const replyServices = {
  postReply: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    Reply.create({
      UserId: USERID,
      TweetId: req.body.tweetId,
      comment: req.body.comment
    }).then(reply => {
      console.log('reply', reply)
      return callback({ status: 'success', message: 'Reply was successfully posted' })
    })
  }
}
module.exports = replyServices