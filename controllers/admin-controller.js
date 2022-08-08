const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')

const { User, Tweet } = require('../models')

const adminController = {
  signin: async (req, res, next) => {
    try {
      const { account, password } = req.body

      // Check if any field remains blank
      if (!account?.trim() || !password?.trim()) {
        return res.status(400).json({
          status: 'error',
          message: 'All fields are required.'
        })
      }

      // Find admin
      const user = await User.findOne({
        raw: true,
        where: {
          account,
          role: 'admin'
        }
      })

      // Check if admin exists and password correct
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'Account not exists for admin'
        })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({
          status: 'error',
          message: 'Password incorrect.'
        })
      }

      // Generate token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      delete user.password

      return res.status(200).json({ token, user })
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      // Get query for pagination(optional)
      const limit = Number(req.query.count) || null
      const offset = (Number(req.query.page) - 1) * limit || null

      const usersData = await User.findAll({
        limit,
        offset,
        include: [{ model: Tweet, attributes: [] }],
        attributes: [
          'id', 'account', 'name', 'avatar', 'cover',
          [
            sequelize.fn('COUNT', sequelize.col('Tweets.UserId')),
            'tweetCount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Tweets INNER JOIN Likes ON Tweets.id = Likes.TweetId WHERE Tweets.UserId = User.id)'),
            'likeCount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Followships WHERE Followships.FollowerId = User.id)'),
            'followingCount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Followships WHERE Followships.FollowingId = User.id)'),
            'followerCount'
          ]
        ],
        order: [[sequelize.literal('tweetCount'), 'DESC']],
        group: ['User.id']
      })

      return res.status(200).json(usersData)
    } catch (err) {
      next(err)
    }
  },
  deleteTweet: async (req, res, next) => {
    try {
      const { id } = req.params
      const tweet = await Tweet.findByPk(id)

      if (!id || !tweet) {
        return res.status(404).json({
          status: 'error',
          message: 'Invalid id parameter or no tweet was found'
        })
      }

      await tweet.destroy()
      return res.status(200).json({
        status: 'success',
        message: '1 tweet was deleted'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
