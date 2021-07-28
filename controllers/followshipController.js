const followshipService = require('../services/followshipService')

const followshipController = {
  addFollowing: async (req, res) => {
    const followerId = req.user.id
    const followingId = req.body.id

    try {
      const data = await followshipService.addFollowing(followerId, followingId)

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  removeFollowing: async (req, res) => {
    const followerId = req.user.id
    const followingId = req.params.id

    try {
      const data = await followshipService.removeFollowing(followerId, followingId)

      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  }
}

module.exports = followshipController
