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
  removeFollowing: async (req, res, callback) => {
    const { followingId } = req.params
    const followerId = helpers.getUser(req).id

    try {
      const removeResult = await Followship.destroy({ where: { followerId, followingId } })

      if (removeResult === 0) {
        return callback(400, { status: 'error', message: 'unable to remove no follow user' })
      }
      callback(200, { status: 'success', message: 'remove following successfully' })
    } catch (err) {
      console.log('removeFollowing error', err)
      res.sendStatus(500)
    }
  }
}

module.exports = followshipService
