const followshipService = require('../services/followshipService.js')
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: async (req, res, next) => {
    const followingId = Number(req.body.id)
    const followerId = Number(helpers.getUser(req).id)

    if (followingId === followerId) {
      return res.status(403).json({
        status: 'error',
        message: 'Cannot follow yourself'
      })
    }
    try {
      const { status, message } = await followshipService.addFollowing(followingId, followerId)
      return res.status(200).json({
        status,
        message
      })
    } catch (error) {
      next(error)
    }
  },
  removeFollowing: async (req, res, next) => {
    const { followingId } = req.params
    const followerId = helpers.getUser(req).id

    try {
      const { status, message } = await followshipService.removeFollowing(followingId, followerId)
      return res.status(200).json({
        status,
        message
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = followshipController
