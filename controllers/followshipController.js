const followshipService = require('../services/followshipService')

const followshipController = {
  addFollow: async (req, res, next) => {
    try {
      const data = await followshipService.addFollow(req.user.id, req.body.id)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  },

  unFollow: async (req, res, next) => {
    try {
      const data = await followshipService.unFollow(req.user.id, req.params.followingId)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = followshipController
