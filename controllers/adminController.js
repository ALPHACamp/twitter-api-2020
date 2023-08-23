'use strict'

const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')
const { getUser } = require('../_helpers')
const { User } = require('../models')

const adminController = {
  login: async (req, res, next) => {
    try {
      const userData = getUser(req).toJSON()
      delete userData.password

      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.status(200).json({
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
        attributes: ['id', 'name', 'account', 'avatar', 'cover',
          [sequelize.literal('(SELECT COUNT(id) FROM Followships WHERE Followships.followingId = User.id)'), 'follower'],
          [sequelize.literal('(SELECT COUNT(id) FROM Followships WHERE Followships.followerId = User.id)'), 'following'],
          [sequelize.literal('(SELECT COUNT(id) FROM tweets WHERE tweets.UserId = user.id)'), 'tweetCount'],
          [sequelize.literal('(SELECT COUNT(id) FROM likes WHERE likes.UserId = user.id and likes.isLiked = true)'), 'likeCount']
        ],
        order: [[sequelize.literal('tweetCount'), 'DESC']],
        raw: true,
        nest: true
      })

      if (!users.length) return res.status(200).json({ status: 'success', message: '無User資料' })

      res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = adminController
