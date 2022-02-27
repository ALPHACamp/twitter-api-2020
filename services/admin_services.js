const jwt = require('jsonwebtoken')
const sequelize = require('sequelize')
const { getUser } = require('../_helpers')
const { User, Tweet } = require('../models')

const adminServices = {
  userLogin: (req, cb) => {
    const userData = getUser(req).toJSON()
    delete userData.password
    try {
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, {
        status: 'success',
        message: '成功登入',
        token,
        userData
      })
    } catch (err) {
      cb(err)
    }
  },
  getUsers: (req, cb) => {
    return User.findAll({
      where: { role: 'user' },
      attributes: ['id', 'account', 'name', 'cover', 'avatar',
        [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Tweets WHERE Tweets.UserId = User.id)'),
          'tweetAmount'],
        [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Followships WHERE Followships.followingId = User.id)'),
          'follower'],
        [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Followships WHERE Followships.followerId = User.id)'),
          'following'],
        [sequelize.literal('(SELECT COUNT(DISTINCT id) FROM Likes WHERE Likes.UserId = User.id)'), 'likeAmount']
      ],
      order: [[sequelize.col('tweetAmount'), 'DESC']],
      raw: true,
      nest: true
    })
      .then(user => cb(null, user))
      .catch(err => cb(err))
  }
}
module.exports = adminServices
