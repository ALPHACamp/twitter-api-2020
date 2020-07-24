const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const moment = require('moment')

const adminController = {

  getUsers: (req, res) => {
    return User.findAll({
      include: [
        Reply, Like,
        { model: Tweet, include: [Like] },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        FollowingCount: user.Followings.length,
        tweetCounts: user.Tweets.length,
        tweetLikedCounts: user.Tweets.map(r => r.Likes.length).reduce(function (a, b) { return a + b }, 0)
      }))
      users = users.sort((a, b) => b.tweetCounts - a.tweetCounts)
      return res.json({
        users: users
      })
    })
  },
}
module.exports = adminController