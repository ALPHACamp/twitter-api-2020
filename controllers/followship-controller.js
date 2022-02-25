const helpers = require('../_helpers')
const { User, Followship } = require('../models')

const followshipController = {
  addFollowing: (req, res, next) => {
    const userId = helpers.getUser(req).id
    const toBeFollowedUserId = Number(req.body.id)

    if (userId === toBeFollowedUserId) throw new Error("Cannot follow yourself!")

    return Promise.all([
      User.findByPk(toBeFollowedUserId),
      Followship.findOne({
        where: {
          followerId: userId,
          followingId: toBeFollowedUserId
        },
        raw: true
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User didn't exist!")
        if (followship) throw new Error('You are already following this user!')

        return Followship.create({
          followerId: userId,
          followingId: toBeFollowedUserId
        })
      })
      .then(followship => {
        res.status(200).json(followship)
      })
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    const userId = helpers.getUser(req).id
    const toBeRemovedFollowingUserId = Number(req.params.id)
    
    return Followship.findOne({
      where: {
        followerId: userId,
        followingId: toBeRemovedFollowingUserId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(followship => res.status(200).json(followship))
      .catch(err => next(err))
  }
}
module.exports = followshipController
