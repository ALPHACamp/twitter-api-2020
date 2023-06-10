const { Followship } = require('../models')
const helpers = require('../_helpers.js')

const followshipServices = {
  addFollowing: (req, cb) => {
    const followerId = Number(helpers.getUser(req).id)
    const followingId = Number(req.body.id)
    if (followerId === followingId) throw new Error('current cannot follow themselves.')
    Followship.findOne({
      where: {
        followerId,
        followingId
      }
    })
      .then(followeship => {
        if (followeship) throw new Error('current user had followed this user.')
        return Followship.create({ followerId, followingId })
      })
      .then(addFollowership => cb(null, addFollowership))
      .catch(err => cb(err))
  },
  removeFollowing: (req, cb) => {
    const followerId = Number(helpers.getUser(req).id)
    const followingId = Number(req.params.followingId)
    Followship.findOne({
      where: {
        followerId,
        followingId
      }
    })
      .then(followship => {
        if (!followship) throw new Error('current user didn\'t follow this user.')
        return followship.destroy()
      })
      .then(removefollowship => cb(null, removefollowship))
      .catch(err => cb(err))
  }
}

module.exports = followshipServices
