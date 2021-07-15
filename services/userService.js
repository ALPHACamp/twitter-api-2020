const db = require('../models')
const { User, Tweet, Like, Followship, Sequelize } = db

const userService = {
  getUser: (req, res, UserId, viewerRole) => {
    return User.findByPk(UserId)
      .then(user => {
        if (!user) {
          return res.status(401).json({ status: 'error', message: 'User not found.' })
        }
        const { id, name, account, avatar, cover, introduction, followerCount, followingCount } = user
        return res.status(200).json({
          id, name, account, avatar, cover, introduction, followerCount, followingCount
        })
      })
  }
}

module.exports = userService
