const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: (req, res, next) => {
    // const followingId = req.body.id
    const followingId = 1
    const followerId = helpers.getUser(req).id
    Promise.all([
      User.findByPk(followerId),
      Followship.findOne({
        where: { followingId, followerId }
      })
    ])
      .then(([user, followship]) => {
        if (!user) throw new Error("User did't exist!")
        if (followship) throw new Error('You are already following this user!')
        return Followship.create({
          followingId,
          followerId
        })
      })
      .then(() => res.json('status: "success'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    const followingId = req.params.followingId
    const followerId = helpers.getUser(req).id
    return Followship.findOne({
      where: {
        followingId: followingId,
        followerId: followerId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(() => res.json({ status: 'success' }))
      .catch(err => next(err))
  }
}
module.exports = followshipController
