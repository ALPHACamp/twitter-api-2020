const { Tweet, Reply, User } = require('../models')

const helpers = require('../_helpers')

const replyService = {
  postReply: (req, res, callback) => {
    Reply.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.tweet_id,
      comment: req.body.comment
    }).then(reply => {
      return callback({ status: 'success', message: '成功回覆推文' })
    })
  }
}

module.exports = replyService
