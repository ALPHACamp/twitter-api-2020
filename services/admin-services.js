const { User, Tweet, Like, Reply } = require('../models')

const adminServices = {
  getUsers: (req, cb) => {
    User.findAll({
      include: [
        Tweet,
        Like,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(users => {
        const userData = users.map(user => {
          const data = {
            ...user.toJSON(),
            followerCounts: user.Followers.length,
            followingCounts: user.Followings.length,
            tweetCounts: user.Tweets.length,
            likeCounts: user.Likes.length
          }
          delete data.password
          delete data.role
          delete data.introduction
          delete data.Tweets
          delete data.Likes
          delete data.Followers
          delete data.Followings
          return data
        })
          .sort((a, b) => b.tweetCounts - a.tweetCounts)
        return cb(null, userData)
      })
      .catch(err => cb(err))
  },
  getTweets: (req, cb) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      include: User
    })
      .then(tweets => {
        tweets = tweets.map(tweet => {
          tweet = {
            ...tweet.toJSON(),
            description: tweet.description.substring(0, 50)
          }
          delete tweet.User.password
          delete tweet.User.coverPhoto
          delete tweet.User.introduction
          delete tweet.User.role
          delete tweet.User.createdAt
          delete tweet.User.updatedAt
          return tweet
        })
        return cb(null, tweets)
      })
      .catch(err => cb(err))
  },
  deleteTweet: (req, cb) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          const err = new Error("Tweet didn't exist!")
          err.status = 404
          throw err
        }
        return Promise.all([
          tweet.destroy(),
          Reply.destroy({ where: { TweetId: req.params.id } }),
          Like.destroy({ where: { TweetId: req.params.id } })
        ])
      })
      .then(([deletedTweet, deletedReplies, deleteLikes]) => cb(null, deletedTweet))
      .catch(err => cb(err))
  }
}

module.exports = adminServices
