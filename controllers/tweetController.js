const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const moment = require('moment')

let restController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User, Reply, { model: User, as: 'LikedUsers' }]
    }).then(tweets => {
      const data = tweets.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        tweetCreatedAt: moment(r.dataValues.createdAt).fromNow(),
        userName: r.User.name,
        userAvatar: r.User.avatar,
        userAccount: r.User.account,
        replyConut: r.Replies.length,
        likeConut: r.LikedUsers.length,
        // isLiked: req.user.LikedTweets.map(d => d.id).includes(r.id)
      }))
      return res.json({ Tweets: data })
    })
  },
  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: Reply, include: [User] },
        { model: User, as: 'LikedUsers' }
      ]
    }).then(tweet => {
      // const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
      return res.json({
        tweet: tweet,
        replyConut: tweet.Replies.length,
        likeConut: tweet.LikedUsers.length,
        tweetCreatedAt: moment(tweet.dataValues.createdAt).fromNow(),
        // isLiked: isLiked
      })
    })
  },
}
module.exports = restController