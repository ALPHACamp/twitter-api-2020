const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')
const { User, Tweet, Like, Reply } = require('../models')

const adminController = {
  signIn: async (req, cb) => {
    try {
      if (req.user.role !== 'admin') return cb(new Error('you are not admin user, permission denied'))
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      const tokenData = {
        status: 'success',
        data: {
          token,
          User: userData
        }
      }
      return cb(null, { tokenData })
    } catch (err) {
      return cb(err)
    }
  },
  getUsers: async (req, cb) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'account', 'email', 'name', 'avatar', 'cover', 'introduction', 'role', 'createdAt', 'updatedAt',
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Replies.id'))), 'RepliesCount'],
          [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Likes.id'))), 'LikesCount']
        ],
        include: [
          Like,
          Reply,
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ],
        group: ['User.id'],
        raw: true,
        nest: true
      })
      for (const user of users) {
        delete user.Likes
        delete user.Replies
        delete user.Followers
        delete user.Followings
      }
      return cb(null, users)
    } catch (err) {
      return cb(err)
    }
  },
  deleteTweet: async (req, cb) => {
    try {
      const tweet = await Tweet.findOne({ where: { id: req.params.id } })
      if (!tweet) throw new Error("Tweet doestn't exit!")
      const deletedTweet = await tweet.destroy()
      const TweetData = {
        status: 'success',
        ...deletedTweet.dataValues
      }
      return cb(null, { TweetData })
    } catch (err) {
      return cb(err)
    }
  }
}
module.exports = adminController
