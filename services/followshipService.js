const { Followship, User, Sequelize } = require('../models')
const apiError = require('../libs/apiError')

const followshipService = {
  addFollowing: async (followingId, followerId) => {
    const user = await User.findByPk(followingId, { raw: true })
    if (!user) {
      throw apiError.badRequest(404, "User doesn't exist")
    }

    if (user.role === 'admin') {
      throw apiError.badRequest(403, 'Cannot follow administrator')
    }

    const [_, isFollowed] = await Followship.findOrCreate({
      where: { followerId, followingId }
    })

    if (!isFollowed) {
      throw apiError.badRequest(403, 'You have already followed this user')
    }

    return {
      status: 'success',
      message: 'Add following successfully'
    }
  },
  removeFollowing: async (followingId, followerId) => {
    const removeResult = await Followship.destroy({ where: { followerId, followingId } })

    if (removeResult === 0) {
      throw apiError.badRequest(403, 'Unable to remove no follow user')
    }

    return {
      status: 'success',
      message: 'Remove following successfully'
    }
  }
}

module.exports = followshipService
