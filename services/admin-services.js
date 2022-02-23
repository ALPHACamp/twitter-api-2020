const { Tweet, User, Like, Reply, Followship } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')

const adminServices = {
  signIn: async (req, cb) => {
    try {
      let result = {}
      const { account, password } = req.body
      if (!account || !password) {
        throw new Error('All fields are required!')
      }
      const user = await User.findOne({ where: { account } })
      if (!user) {
        throw new Error('User not found!')
      } else if (!bcrypt.compareSync(password, user.password)) {
        throw new Error('Incorrect Account or Password!')
      } else if (user.role !== 'admin') {
        throw new Error('請使用管理者帳戶登入!')
      } else {
        result = user.toJSON()
      }
      if (result) {
        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })
        delete result.password
        return cb(null, { token, user: result })
      }
    } catch (err) {
      return cb(err)
    }
  },
  getTweets: async (req, cb) => {
    try {
      const tweets = await Tweet.findAll({
        include: { model: User },
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']]
      })
      const result = tweets.map(tweet => ({
        ...tweet,
        description: tweet.description.substring(0, 50)
      }))
      return cb(null, result)
    } catch (err) {
      cb(err)
    }
  },
  deleteTweet: async (req, cb) => {
    try {
      const tweetId = await req.params.id
      const like = await Like.destroy({ where: { tweetId } })
      const reply = await Reply.destroy({ where: { tweetId } })
      const tweet = await Tweet.destroy({ where: { id: tweetId } })
      return cb(null, { like, reply, tweet })
    } catch (err) {
      cb(err)
    }
  },
  getUsers: async (req, cb) => {
    try {
      const users = await User.findAll({
        raw: true,
        nest: true,
        attributes: {
          exclude: [
            'email',
            'password',
          ],
          include: [
            'id',
            'name',
            'account',
            'avatar',
            'cover',
            'role',
            [sequelize.literal("(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)"), 'tweetCount'],
            [sequelize.literal("(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = User.id)"), 'likeCount'],
            [sequelize.literal("(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)"), 'followerCount'],
            [sequelize.literal("(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)"), 'followingCount']
          ]
        },
        group: ['User.id'],
        order: [
          [sequelize.literal('tweetCount'), 'DESC'],
          ['id', 'ASC']
        ]
      })
      const result = users.map(user => ({ ...user }))
      return cb(null, result)
    } catch (err) {
      cb(err)
    }
  },
}
module.exports = adminServices