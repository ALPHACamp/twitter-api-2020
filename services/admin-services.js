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
      }],
      //  offset,
      group: 'id',
      order: [['createdAt', 'DESC']],
      nest: true,
      raw: true
    })
      .then(users => {
        const data = users.map(user => {
          delete user.password
          return user
        })
        cb(null, data)
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
