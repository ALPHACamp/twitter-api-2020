const assert = require('assert')
const { User, Reply, Tweet, Like } = require('../models')
const { getUser } = require('../_helpers')

const userController = {
  getUser: (req, res, next) => {
    const { id } = req.params
    return User.findByPk(id, {
      include: [
        Reply, Tweet, Like,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ],
      nest: true
    })
      .then(user => {
        if (!user) assert(user, "User doesn't exist!")
        res.json({ status: 'success', data: user })
      })
      .catch(err => next(err))
  },
  getUsers: (req, res, next) => {
    const top = Number(req.query.top)
    const currentUser = getUser(req)
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: currentUser.Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
          .slice(0, top || users.length)
        res.json({ status: 'success', data: result })
      })
      .catch(err => next(err))
  }
}

module.exports = userController
