const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: (req, res, next) => {
    // const followingId = req.body.userId
    const followingId = 2
    // const followerId = helpers.getUser(req)
    console.log('follower:', helpers.getUser(req))
    const followerId = 3
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
    const followerId = helpers.getUser(req)
    return Followship.find({
      where: {
        followingId,
        followerId
      }
    })
      .then(followship => {
        if (!followship) throw new Error("You haven't followed this user!")
        return followship.destroy()
      })
      .then(() => res.json('status: "success'))
      .catch(err => next(err))
  }

}
module.exports = followshipController
