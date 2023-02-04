// eslint-disable-next-line no-unused-vars
const { User, Tweet, Like, sequelize } = require('../models')
// const { getOffset, getPagination } = require('../helpers/pagination-helper')
const assert = require('assert')
const adminServices = {
  getUsers: (req, cb) => {
    return User.findAll({
      //  offset,

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
