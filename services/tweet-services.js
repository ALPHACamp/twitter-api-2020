const { User, Tweet, Reply, Like } = require('../models')
const helpers = require('../_helpers.js')

const tweetServices = {
  getTweets: (req, cb) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: [User, Reply, Like]
    })
      .then(tweets => {
        tweets = tweets.map(tweet => {
          tweet = {
            ...tweet.toJSON(),
            isLiked: tweet.Likes.map(tweet => tweet.userId).includes(helpers.getUser(req).id),
            replyCount: tweet.Replies.length,
            likedCount: tweet.Likes.length
          }
          delete tweet.Replies
          delete tweet.Likes
          return tweet
        })
        return cb(null, tweets)
      })
      .catch(err => cb(err))
  }
}

module.exports = tweetServices
