const sequelize = require('sequelize')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const adminService = {
  getTweets: (req, res, callback, next) => {
    return Tweet.findAll({
      include: [User]
    })
      .then(tweets => {
        callback(tweets)
      })
      .catch(err => {
        next(err)
      })
  },
  getUsers: (req, res, callback, next) => {
    return User.findAll({
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'TweetCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = User.id)'), 'LikeCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.UserId = User.id)'), 'RepliesCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'), 'FollowingCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'FollowerCount']
        ]
      }
    })
      .then(users => {
        callback(users)
      })
  },

  deleteTweet: (req, res, callback) => {
    return Tweet.findByPk(req.params.id)
      .then((tweet) => {
        tweet.destroy()
          .then((tweet) => {
            callback({ status: 'success', message: '' })
          })
      })
  }
}

module.exports = adminService
