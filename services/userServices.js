const db = require('../models')
const helpers = require('../_helpers')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const userServices = {
  likeTweet: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    Like.create({
      UserId: USERID,
      TweetId: req.params.id
    }).then(like => {
      return callback({ status: 'success', message: `Like tweet` })
    })
  },
  unlikeTweet: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    Like.findOne({
      where: {
        UserId: USERID,
        TweetId: req.params.id
      }
    }).then(like => {
      like.destroy()
        .then(tweet => {
          return callback({ status: 'success', message: `DisLike tweet` })
        })
    })
  },
  getUserReplies: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    User.findByPk(USERID, { include: [{ model: Tweet, as: 'RepliedTweets' }] })
      .then(user => {
        return callback({ user })
      })
  },
  getUserLikes: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    User.findByPk(USERID, { include: [{ model: Tweet, as: 'LikedTweets' }] })
      .then(user => {
        return callback({ user })
      })
  }
}
module.exports = userServices