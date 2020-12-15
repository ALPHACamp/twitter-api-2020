const db = require('../models')
const Reply = db.Reply
const Tweet = db.Tweet
const User = db.User
const helpers = require('../_helpers')

const replyServices = {
  postReply: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    Reply.create({
      UserId: USERID,
      TweetId: req.params.tweet_id,
      comment: req.body.comment
    }).then(reply => {
      return callback({ status: 'success', message: 'Reply was successfully posted' })
    })
  },
  getReply: (req, res, callback) => {
    Reply.findAll({
      raw: true, nest: true
    }).then(reply => {
      Tweet.findByPk(req.params.tweet_id,
        {
          include: [
            { model: Reply, include: [User] }
          ]
        })
        .then(tweet => {
          return callback({ tweet: tweet.toJSON() })
        })

    })
  }
}
module.exports = replyServices