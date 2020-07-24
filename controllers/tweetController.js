const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const moment = require('moment')

let tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User, Reply, Like]
    }).then(tweets => {
      const data = tweets.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        tweetCreatedAt: moment(r.dataValues.createdAt).fromNow(),
        userName: r.User.name,
        userAvatar: r.User.avatar,
        userAccount: r.User.account,
        replyConut: r.Replies.length,
        likeConut: r.Likes.length,
        isLiked: req.user.LikedTweets.map(d => d.id).includes(r.id)
      }))
      return res.json({ Tweets: data })
    })
  },
  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      order: [[{ model: Reply }, 'createdAt', 'DESC']],
      include: [
        User,
        Like,
        { model: Reply, include: [User] },
        { model: User, as: 'LikedUsers' }
      ]
    }).then(tweet => {
      const isLiked = tweet.LikedUsers.map(d => d.id).includes(req.user.id)
      return res.json({
        tweet: tweet,
        replyConut: tweet.Replies.length,
        likeConut: tweet.Likes.length,
        tweetCreatedAt: moment(tweet.dataValues.createdAt).fromNow(),
        isLiked: isLiked
      })
    })
  },
  postTweet: (req, res) => {
    if (!req.body.text) {
      return res.json({ status: 'error', message: "貼文不能為空白" })
    } else if (req.body.text.length > 140) {
      return res.json({ status: 'error', message: "字數限制為140字以內" })
    } else {
      return Tweet.create({
        description: req.body.text,
        // UserId: req.user.id
      })
        .then((tweet) => {
          return res.json({ status: 'success', message: '推文成功' })
        })
    }
  },
}
module.exports = tweetController