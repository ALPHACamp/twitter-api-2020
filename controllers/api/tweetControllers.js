const db = require('../../models')
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const tweetController = {
  getTweets: (req, res) => {
    return Tweet.findAll({ include: [{ model: Reply }, { model: Like }] }).then(tweets => {
      tweets = tweets.map(tweet => ({
        ...tweet.toJSON(),
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length
      }))
      return res.json(tweets)
    })
  }
}
module.exports = tweetController
