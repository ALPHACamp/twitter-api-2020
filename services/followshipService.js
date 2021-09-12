const { Followship } = require('../models')

const helpers = require('../_helpers')

const followshipService = {
  addFollowing: async (req, res, callback) => {
    const followerId = Number(helpers.getUser(req).id)
    const followingId = Number(req.body.id)

    if (followerId === followingId) {
      return callback({
        status: 'error',
        message: 'You cannot follow yourself.'
      })
    }

    await Followship.create({
      followerId,
      followingId
    })
    return callback({ status: 'success', message: 'Followed successfully' })
  },
  deleteFollowing: async (req, res) => {
    await Followship.destroy({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.followingId
      }
    })
    return { status: 'success', message: 'Unfollowed successfully' }
  }
}

module.exports = followshipService
