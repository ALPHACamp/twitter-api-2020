const { User, Tweet, sequelize } = require('../models')
const assert = require('assert')
const adminServices = {
  getUsers: (req, cb) => {
    return User.findAll({
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.User_id = User.id)'), 'totalTweets'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.User_id = User.id)'), 'totalLikes'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount']
        ],
        exclude: ['password']
      },
      order: [[sequelize.literal('totalTweets'), 'DESC'], ['role', 'DESC'], ['id', 'ASC']],
      nest: true,
      raw: true
    })
      .then(users => {
        assert(users, '無使用者！')
        const result = users
        cb(null, result)
      })
      .catch(err => cb(err))
  },
  deleteTweet: (req, cb) => {
    const id = req.params.tweetId
    return Tweet.findByPk(id)
      .then(tweet => {
        assert(tweet, '無此推文！')
        return tweet.destroy()
      })
      .then(deletedTweet => cb(null, { deletedTweet }))
      .catch(err => cb(err))
  }
}

module.exports = adminServices
