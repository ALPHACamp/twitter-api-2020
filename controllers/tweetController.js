const db = require('../models')
const Tweet = db.Tweet
const Like = db.Like

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
}

module.exports = tweetController
