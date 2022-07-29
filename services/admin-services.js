const db = require('../models')
const { User, Tweet, Like } = db
const sequelize = require('sequelize')
const { Op } = require("sequelize")
const bcrypt = require('bcryptjs')

const adminServices = {
  getUsers: async (req, cb) => {
    return await User.findAll({
      where: {
        [Op.not]: [
          { role: 'admin' },
        ]
      },
      attributes: [
        'id', 'account', 'name', 'email', 'avatar',
        [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'TweetsCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE user_id = User.id)'), 'LikesCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE following_id = User.id)'), 'FollowingCount'],
        [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE follower_id = User.id)'), 'FollowerCount']
      ],
      order: [[sequelize.literal('TweetsCount'), 'DESC']],
      raw: true,
      nest: true
    })
      .then(users => cb(null, { users }))
      .catch(err => cb(err))
  },
  getTweets: async (req, cb) => {
    return await Tweet.findAll({
      order: [['createdAt', 'DESC']], //? post tweet功能做好後測試 order 功能
      include: {
        model: User,
        attributes: {
          exclude: ['password']
        }
      },
      raw: true,
      nest: true
    })
      .then(tweets => cb(null, { tweets }))
      .catch(err => cb(err))
  },
  deleteTweet: async (req, cb) => {
    return Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) throw new Error("tweet didn't exist!")
        return tweet.destroy()

      })
      .then(deletedTweet => cb(null, { tweet: deletedTweet }))
      .catch(err => cb(err))
  }
}

module.exports = adminServices