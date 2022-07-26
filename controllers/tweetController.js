const db = require('../models')
const Tweet = db.Tweet
const Like = db.Like
const Reply = db.Reply

const tweetController = {
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
    Reply.findAll({ where: { UserId: userId, TweetId: tweetId }})
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
