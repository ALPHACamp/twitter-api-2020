const { Tweet, User } = require('../models')
const Sequelize = require('sequelize')

const adminServices = {
  // 推文
  getTweets: (req, cb) => {
    Tweet.findAll({
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(tweets => cb(null, tweets))
      .catch(err => cb(err))
  },
  deleteTweet: (req, cb) => {
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error('此推文不存在')
        return tweet.destroy()
      })
      .then(tweet => cb(null, tweet))
      .catch(err => cb(err))
  },
  getUsers: (req, cb) => {
    User.findAll({
      attributes: {
        include: [
          [Sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.user_id = User.id)'), 'tweetsCount'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followersCount'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingsCount'],
          [Sequelize.literal('(SELECT COUNT(*) FROM Tweets JOIN Likes on Tweets.id = Likes.tweet_id WHERE Tweets.user_id = User.id)'), 'tweetsLikedCount']
        ]
      },
      group: ['User.id'],
      order: [
        [Sequelize.literal('tweetsCount'), 'DESC']
      ],
      nest: true,
      raw: true
    })
      .then(users => {
        // 調整回傳的使用者資料
        const updatedUser = users.map(user => {
          delete user.password
          return user
        })
        return updatedUser
      })
      .then(users => cb(null, users))
      .catch(err => cb(err))
  }
}
module.exports = adminServices
