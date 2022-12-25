// eslint-disable-next-line no-unused-vars
const { User, Tweet, Like, sequelize } = require('../models')
// const { getOffset, getPagination } = require('../helpers/pagination-helper')
const assert = require('assert')
const adminServices = {
  getUsers: (req, cb) => {
    return User.findAll({
      //  offset,
      attributes: { exclude: ['password'] },
      nest: true,
      raw: true
    })
      .then(users => {
        const result = users
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
