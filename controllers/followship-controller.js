const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: (req, res, next) => {
    const followingId = req.body.id
    const currentUserId = helpers.getUser(req).id

    if (followingId === currentUserId) throw new Error("You can't follow yourself.")

    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followerId: currentUserId,
          followingId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User doesn't exist.")
        if (followship) throw new Error('You are already follow this user.')

        return Followship.create({
          followerId: currentUserId,
          followingId
        })
      })
      .then(followship => res.status(200).json({ status: 'success', followship }))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    const followingId = req.params.id
    const currentUserId = helpers.getUser(req).id

    return Promise.all([
      User.findByPk(followingId),
      Followship.findOne({
        where: {
          followingId,
          followerId: currentUserId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user || user.role === 'admin') throw new Error("User doesn't exist.")
        if (!followship) throw new Error("You're not follower")

        return followship.destroy()
      })
      .then(() => res.status(200).json({
        status: 'success',
        message: 'Following remove'
      }))
      .catch(err => next(err))
  }
}

module.exports = followshipController
