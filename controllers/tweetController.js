const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply

const tweetController = {
  getTweets: (req, res) => {
    const userId = 1
    Tweet.findAll({ where: { UserId: userId }, include: [User, Like, Reply] })
      .then(tweets => {
        return res.json(tweets)
      })
  },
  getTweet: (req, res) => {
    const tweetId = req.params.id
    Tweet.findByPk(tweetId)
      .then(tweet => {
        return res.json(tweet)
      })
  },
  postTweet: (req, res) => {
    const userId = req.body.UserId || 1
    const description = req.body.description
    Tweet.create({
      UserId: userId,
      description: description
    })
      .then(tweet => {
        return res.json({ status: 'success', message: '' })
      })
  },
  likeTweet: (req, res) => {
    const userId = 1
    const tweetId = req.params.id
    Like.create({
      UserId: userId,
      TweetId: tweetId
    })
      .then(like => {
        return res.json({ status: 'success', message: '' })
      })
  },
  unlikeTweet: (req, res) => {
    const userId = 1
    const tweetId = req.params.id
    Like.findOne({
      where: {
        UserId: userId,
        TweetId: tweetId
      }
    })
      .then(like => {
        like.destroy()
          .then(() => {
            return res.json({ status: 'success', message: '' })
          })
      })
  },
  getTweetReplies: (req, res) => {
    const userId = 1
    const tweetId = req.params.id
    Reply.findAll({ where: { UserId: userId, TweetId: tweetId } })
      .then(replies => {
        return res.json(replies)
      })
  },
  postTweetReply: (req, res) => {
    const userId = 1
    const tweetId = req.params.id
    const comment = req.body.comment
    Reply.create({
      UserId: userId,
      TweetId: tweetId,
      comment: comment
    })
      .then(reply => {
        return res.json(reply)
      })
  }
}

module.exports = tweetController
