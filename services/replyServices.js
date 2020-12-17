const db = require('../models')
const Reply = db.Reply
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
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
    Tweet.findByPk(req.params.tweet_id, {
      include: [
        User
      ]
    }).then(tweet => {
      Reply.findAndCountAll({ include: [User], where: { TweetId: req.params.tweet_id } })
        .then(replies => {
          Like.findAndCountAll({ where: { TweetId: req.params.tweet_id } })
            .then(likes => {
              return callback({ tweet, replies, likes })
            })
        })
    })
  }
}
module.exports = replyServices