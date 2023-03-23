const jwt = require('jsonwebtoken')
const { getUser } = require('../_helpers')
const db = require('../models')
const { User } = db

const adminServices = {
  postSignIn: (req, cb) => {
    const userData = getUser(req).toJSON()
    delete userData.password
    try {
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, {
        status: 'success',
        message: '成功登入',
        data: {
          token,
          userData
        }
      })
    } catch (err) {
      cb(err)
    }
  },
  getTopUsers: (req, res, next) => {
    try {
      User.findAll({ include: [{ model: User, as: 'Followers' }] })
        .then(users => {
          users = users.map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: req.user.Followings.some(f => f.id === user.id)
          }))
          users = users.sort((a, b) => b.followerCount - a.followerCount)
          res.json({ status: 'success', data: { users } })
        })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = adminServices
