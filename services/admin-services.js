const jwt = require('jsonwebtoken')
const { getUser } = require('../_helpers')
const { User, sequelize } = require('../models')

const adminServices = {
  signIn: (req, cb) => {
    try {
      const userData = getUser(req).toJSON()
      if (userData.role !== 'admin') throw new Error('admin permission denied')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, {
        status: 'success',
        message: '成功登入',
        token,
        user: userData
      })
    } catch (err) {
      cb(err)
    }
  },
  getUsers: (req, cb) => {
    return User.findAll({
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.user_id = User.id )'), 'TweetsCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id )'), 'FollowersCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id )'), 'FollowingsCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id )'), 'LikedCount']
        ]
      },
      order: [[sequelize.literal('TweetsCount'), 'DESC'], ['createdAt', 'DESC']],
      raw: true,
      nest: true
    })
      .then(users => cb(null, users))
      .catch(err => cb(err))
  }
}

module.exports = adminServices
