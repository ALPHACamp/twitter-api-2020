const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const moment = require('moment')

let userController = {
  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Tweet, include: [Like, Reply] },
        { model: Reply, include: [Tweet] },
        { model: Like, include: [Tweet] },
      ]
    }).then(user => {
      return res.json({
        user: user,
        tweetCounts: user.Tweets.length,
      })
    })
  },
}
module.exports = userController