// const { getUser } = require('../_helpers')
const db = require('../models')
const { User } = db

const adminServices = {
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
