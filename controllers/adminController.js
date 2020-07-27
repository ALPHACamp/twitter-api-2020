const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const moment = require('moment')
const helpers = require('../_helpers')

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
      return res.json(users)
    }).catch(err => console.log(err))
  },
  deleteTweet: (req, res) => {
    if (req.user.role === 'admin') {
      return Tweet.findByPk(req.params.id)
        .then((tweet) => {
          tweet.destroy()
            .then((tweet) => {
              res.json({ status: 'success', message: "成功刪除貼文" })
            })
        }).catch(err => console.log(err))
    } else {
      res.json({ status: 'error', message: "沒有權限刪除貼文" })
    }

  },
}
module.exports = adminController