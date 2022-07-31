const jwt = require('jsonwebtoken')
const { Sequelize } = require('sequelize')

const { User } = require('../models')

const adminController = {
  signIn: (req, res, next) => {
    try {
      if (req.user.error) {
        return res.json(req.user.error)
      }

      if (req.user.role !== 'admin') {
        res.json({
          status: 'error',
          message: '帳號或密碼錯誤'
        })
      }

      const userData = req.user.toJSON()
      delete userData.password
      delete userData.introduction
      delete userData.createdAt
      delete userData.updatedAt
      const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: '30d'
      })
      res.status(200).json({
        status: 'success',
        token,
        user: userData
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
          'avatar',
          'account',
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)'
            ),
            'tweetsCount'
          ],
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = User.id)'
            ),
            'likedTweetsCount'
          ],
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)'
            ),
            'followingsCount'
          ],
          [
            Sequelize.literal(
              '(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'
            ),
            'followersCount'
          ]
        ],
        order: [[Sequelize.literal('tweetsCount'), 'DESC'], ['name', 'ASC']]
      })
      res.status(200).json(users)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = adminController
