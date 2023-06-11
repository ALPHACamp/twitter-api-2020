const { Tweet, Reply, Like } = require('../../models')

const tweetController = {
  getTweets: (req, res, next) => {
    return Tweet.findAll({
      include: [
        { model: Reply },
        { model: Like }
      ],
      order: [['createdAt', 'DESC']],
    })
      .then(tweets => {
        const formattedTweets = tweets.map(tweet => {
          const tweetData = tweet.toJSON()
          tweetData.RepliesCount = tweet.Replies.length
          tweetData.LikesCount = tweet.Likes.length
          return tweetData
        })
        res.status(200).json({ status: 'success', formattedTweets })
      })
      .catch(err => {
        res.status(500).json({ status: 'error', error: err.message })
      })
  }
}

module.exports = tweetController

