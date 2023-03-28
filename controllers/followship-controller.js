const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const createError = require('http-errors')

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
        if (!user) next(createError(404, "User doesn't exist!"))

        if (followship) next(createError(409, 'You already followed this user!'))

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
        if (!followship) next(createError(404, "You haven't followed this user!"))

        return followship.destroy()
      })
      .then(deletedFollowship => res.json(deletedFollowship))
      .catch(error => next(error))
  }
}

module.exports = followshipController
