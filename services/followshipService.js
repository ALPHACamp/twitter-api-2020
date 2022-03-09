const { Followship } = require('../models')
const ApiError = require('../utils/customError')
const helpers = require('../_helpers')

// FIXME: Move the verification of addFollowing to the controller?
const followshipService = {
  addFollowing: async (req, res) => {
    const followerId = Number(helpers.getUser(req).id)
    const followingId = Number(req.body.id)

    if (followerId === followingId) {
      throw new ApiError('addFollowingError', 400, 'You cannot follow yourself')
    }

    const [_, isCreated] = await Followship.findOrCreate({
      where: { followerId, followingId }
    })

    if (!isCreated) {
      throw new ApiError('addFollowingError', 400, 'You have followed')
    }

    return { status: 'success', message: 'Followed successfully' }
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
