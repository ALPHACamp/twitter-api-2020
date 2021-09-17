const followshipService = require('../services/followshipService.js')

const followshipController = {
  addFollowing: (req, res) => {
    followshipService.addFollowing(req, res, (status, data) => {
      return res.status(status).json(data)
    })
  },
  removeFollowing: (req, res) => {
    followshipService.removeFollowing(req, res, (status, data) => {
      return res.status(status).json(data)
    })
  },
}

module.exports = followshipController
