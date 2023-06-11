const { User, Tweet, Like, Reply, sequelize } = require('../models')

const adminServices = {
  getUsers: (req, cb) => {
    User.findAll({
      attributes: ['id', 'name', 'account', 'avatar', 'coverPhoto',
        [sequelize.literal('(SELECT COUNT (*) FROM Tweets WHERE Tweets.User_id = User.id)'), 'tweetCounts'],
        [sequelize.literal('(SELECT COUNT (*) FROM Likes WHERE Likes.User_id = User.id)'), 'likeCounts'],
        [sequelize.literal('(SELECT COUNT (*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount'],
        [sequelize.literal('(SELECT COUNT (*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingCount']
      ],
      order: [[sequelize.literal('tweetCounts'), 'DESC']],
      raw: true,
      nest: true
    })
      .then(users => cb(null, users))
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
