const followshipService = require('../services/followshipService')

const followshipController = {
  addFollowing: async (req, res) => {
    const data = await followshipService.addFollowing(req, res)
    if (data['status'] === 'error') {
      return res.status(401).json(data)
    }

    return res.status(200).json(data)
  },
  deleteFollowing: async (req, res) => {
    const data = await followshipService.deleteFollowing(req, res)
    return res.status(200).json(data)
  }
}

module.exports = followshipController
