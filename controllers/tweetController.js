const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const moment = require('moment')

let restController = {
  getTweets: (req, res, callback) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User, Reply, { model: User, as: 'LikedUsers' }]
    }).then(tweets => {
      const data = tweets.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        userName: r.User.name,
        userAvatar: r.User.avatar,
        tweetCreatedAt: moment(r.dataValues.createdAt).fromNow(),
        userAccount: r.User.account,
        replyConut: r.Replies.length,
        likeConut: r.LikedUsers.length,
        // isLiked: req.user.LikedTweets.map(d => d.id).includes(r.id)
      }))
      return res.json({ Tweets: data })
    })
  },
}
module.exports = restController