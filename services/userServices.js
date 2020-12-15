const db = require('../models')
const helpers = require('../_helpers')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship

const userServices = {
  getProfile: (req, res, callback) => {
    const USERID = helpers.getUser(req).id
    return Promise.all([
      Followship.findAndCountAll({ where: { followerId: USERID } }),
      Followship.findAndCountAll({ where: { followingId: USERID } }),
      User.findOne({
        where: { id: USERID },
        include: [
          { model: Tweet, as: 'LikedTweets' }
        ]
      }),
      Tweet.findAll({ where: { UserId: USERID } })
    ])
      .then(([follower, following, user, tweets]) => {
        callback({
          follower: follower,
          following: following,
          user: user,
          tweets: tweets
        })
      })
  },
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
  }
}
module.exports = userServices