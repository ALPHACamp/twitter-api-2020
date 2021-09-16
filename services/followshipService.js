const { Followship } = require('../models')
const ApiError = require('../utils/customError')

const helpers = require('../_helpers')

const followshipService = {
  addFollowing: async (req, res) => {
    const followerId = Number(helpers.getUser(req).id)
    const followingId = Number(req.body.id)

    if (followerId === followingId) {
      throw new ApiError('addFollowingError', 400, 'You cannot follow yourself')
    }

    await Followship.create({
      followerId,
      followingId
    })
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
