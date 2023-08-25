const jwt = require('jsonwebtoken')
const { getUser } = require('../_helpers')
const { User } = require('../models')
const sequelize = require('sequelize')

const adminController = {
  signIn: (req, res, next) => {
    try {
      const userData = getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        attributes: [
          'id',
          'name',
          'account',
          'avatar',
          'cover',
          [
            sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'), 'tweetsAmount'
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId IN (SELECT id FROM Tweets WHERE Tweets.UserId = User.id))'), 'likedAmount'
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'), 'followingAmount'
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'followerAmount'
          ]
        ],
        raw: true
      })

      res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
