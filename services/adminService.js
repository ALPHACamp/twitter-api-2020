const db = require('../models')
const bcrypt = require('bcryptjs')
const sequelize = require('sequelize')
const { Tweet, User, Like, Reply } = db

//JWT
const jwt = require('jsonwebtoken')

const adminService = {
  signIn: async (req, res, callback) => {
    try {
      if (!req.body.email || !req.body.password) {
        return callback({ status: 'error', message: "required fields didn't exist", statusCode: 400 })
      }

      const { email, password } = req.body
      const user = await User.findOne({ where: { email: email } })

      if (!user) return callback({ status: 'error', message: "user not found", statusCode: 401 })

      if (user.role !== 'admin') return callback({ status: 'error', message: "Authorization denied", statusCode: 401 })

      if (!bcrypt.compareSync(password, user.password)) return callback({ status: 'error', message: "password is not correct" })
      //簽發token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET) //之後寫入dotenv
      return callback({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'Internal Server Error', statusCode: 500 })
    }
  },
  getUsers: async (req, res, callback) => {
    try {
      let users = await User.findAll({
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'TweetsCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'), 'FollowingCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'FollowerCount'],
            [sequelize.literal('(SELECT COUNT(*) FROM Likes AS t1 JOIN Tweets AS t2 WHERE t2.UserId = User.id AND t2.id = t1.TweetId)'), 'LikesCount']
          ]
        },
        order: [
          [sequelize.literal('TweetsCount'), 'DESC']
        ]
      })
      callback(users)
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'Internal Server Error', statusCode: 500 })
    }
  },
  getTweets: async (req, res, callback) => {
    try {
      const tweets = await Tweet.findAll({ include: [{ model: User }] })
      callback(tweets)
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'Internal Server Error', statusCode: 500 })
    }
  },
  deleteTweets: async (req, res, callback) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      await tweet.destroy()
      callback({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'Internal Server Error', statusCode: 500 })
    }
  }
}

module.exports = adminService