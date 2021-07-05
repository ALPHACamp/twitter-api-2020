const followshipService = require('../services/followshipService')
const helpers = require('../_helpers')

const followshipController = {
  addFollow: async (req, res, next) => {
    try {
      const data = await followshipService.addFollow(helpers.getUser(req).id, req.body.id)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  },

  unFollow: async (req, res, next) => {
    try {
      const data = await followshipService.unFollow(helpers.getUser(req).id, req.params.followingId)
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = followshipController
