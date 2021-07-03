const followshipService = require('../services/followshipService')

const followshipController = {
  addFollow: async (req, res) => {
    try {
      const data = await followshipService.addFollow(req.body.followerId, req.body.followingId)
      return res.status(200).json(data)
    } catch (error) {
      return res.json(error)
    }
  },

  unFollow: async (req, res) => {
    try {
      const data = await followshipService.unFollow(req.body.followerId, req.params.followingId)
      return res.status(200).json(data)
    } catch (error) {
      return res.json(error)
    }
  },
}

module.exports = followshipController