const jwt = require('jsonwebtoken')
const { User } = require('../models')
const sequelize = require('sequelize')

const adminController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
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
        where: { role: 'user' },
        attributes: [
          'id',
          'name',
          'account',
          'avatar',
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'
            ),
            'tweetsAmount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Likes WHERE Likes.TweetId IN (SELECT id FROM Tweets WHERE Tweets.UserId = User.id))'
            ),
            'likesAmount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'
            ),
            'followingsAmount'
          ],
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'
            ),
            'followersAmount'
          ]
        ],
        order: [
          [sequelize.literal('tweetsAmount'), 'DESC'],
          [sequelize.literal('likesAmount'), 'DESC'],
          [sequelize.literal('followingsAmount'), 'DESC'],
          [sequelize.literal('followersAmount'), 'DESC']
        ],
        nest: true,
        raw: true
      })

      return res.status(200).json(users)
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = adminController
