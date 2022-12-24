// eslint-disable-next-line no-unused-vars
const { User, Tweet, Like } = require('../models')
// const { getOffset, getPagination } = require('../helpers/pagination-helper')
const assert = require('assert')
const adminServices = {
  getUsers: (req, cb) => {
    return User.findAll({
      include: [{
        model: Tweet,
        attributes:
          [[Tweet.sequelize.fn('COUNT', Tweet.sequelize.fn('DISTINCT', Tweet.sequelize.col('tweets.id'))), 'totalTweets']],
        include: [{
          model: Like,
          attributes: [[Like.sequelize.fn('COUNT', Like.sequelize.fn('DISTINCT', Like.sequelize.col('tweets.likes.id'))), 'totalLikes']]
        }]
      }, {
        model: User,
        as: 'Followings',
        attributes: [[User.sequelize.fn('COUNT', User.sequelize.fn('DISTINCT', User.sequelize.col('followings.id'))), 'followingCount']]
      }, {
        model: User,
        as: 'Followers',
        attributes: [[User.sequelize.fn('COUNT', User.sequelize.fn('DISTINCT', User.sequelize.col('followers.id'))), 'followerCount']]
      }],
      //  offset,
      attributes: { exclude: ['password'] },
      group: 'id',
      nest: true,
      raw: true
    })
      .then(users => {
        const result = users.sort((a, b) => b.Tweets.totalTweets - a.Tweets.totalTweets)
        cb(null, result)
      })
      .catch(err => cb(err))
  }, // 軟刪除?
  deleteTweet: (req, cb) => {
    const id = req.params.tweet_id
    return Tweet.findByPk(id)
      .then(tweet => {
        assert(tweet, 'Tweet not found!!')
        return tweet.destroy()
      })
      .then(deletedTweet => cb(null, { deletedTweet }))
      .catch(err => cb(err))
  }
}

module.exports = adminServices
