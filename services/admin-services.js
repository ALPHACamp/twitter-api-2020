const { User, Tweet } = require('../models')
// const { getOffset, getPagination } = require('../helpers/pagination-helper')
const assert = require('assert')
const adminServices = {

  getUsers: (req, cb) => {
    return User.findAll({
      //offset,
      order: [['createdAt', 'DESC']],
      //nest: true,
      raw: true
    })
      .then((users) => {
      users.map(user => { 
      delete user.password 
      return user 
      })
        const data = users
        cb(null, data)
      })
      .catch(err => cb(err))
  }, //軟刪除?
  deleteTweet: (req, cb) => {
    const id = req.params.id
    return Tweet.findByPk(id)
      .then(tweet => {
        assert(tweet, "Tweet not found!!")
        return tweet.destroy()
      })
      .then(deletedTweet => cb(null, { deletedTweet }))
      .catch(err => cb(err))
  }
}

module.exports = adminServices
