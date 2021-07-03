const followshipService = require('../services/followshipService')
const helpers = require('../_helpers')

const followshipController = {
  addFollow: async (req, res) => {
    try {
      const data = await followshipService.addFollow(helpers.getUser(req).id, req.body.id)
      return res.status(200).json(data)
    } catch (error) {
      return res.json(error)
    }
  },

  unFollow: async (req, res) => {
    try {
      const data = await followshipService.unFollow(helpers.getUser(req).id, req.params.followingId)
      return res.status(200).json(data)
    } catch (error) {
      return res.json(error)
    }
  },
}

module.exports = followshipController