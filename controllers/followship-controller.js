const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  postFollowship: (req, res, next) => {
    const userId = helpers.getUser(req).id
    const { id } = req.body

    return Promise.all([
      User.findByPk(id),
      Followship.findOne({
        where: {
          followerId: userId,
          followingId: id
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) {
          const error = new Error("User doesn't exist!")
          error.status = 400
          throw error
        }

        if (followship) {
          const error = new Error('You already followed this user!')
          error.status = 400
          throw error
        }

        return Followship.create({
          followerId: userId,
          followingId: id
        })
          .then(newFollowing => res.json(newFollowing))
          .catch(error => next(error))
      })
      .catch(error => next(error))
  },

  deleteFollowship: (req, res, next) => {
    const followingId = req.params.followingId
    const userId = helpers.getUser(req).id

    return Followship.findOne({
      where: {
        followerId: userId,
        followingId: followingId
      }
    })
      .then(followship => {
        if (!followship) {
          const error = new Error("You haven't followed this user!")
          error.status = 404
          throw error
        }

        return followship.destroy()
      })
      .then(deletedFollowship => res.json(deletedFollowship))
      .catch(error => next(error))
  }
}

module.exports = followshipController
