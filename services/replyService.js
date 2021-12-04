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
  },

  getReply: (req, res, callback) => {
    Reply.findByPk(req.params.tweet_id, { include: [{ model: Tweet }, { model: User }] }).then(tweet => {
      tweet = tweet.toJSON()
      return callback([tweet])
    })
  }
}

module.exports = replyService
