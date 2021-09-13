const followshipService = require('../services/followshipService')

const followshipController = {
  followUser: (req, res) => {
    followshipService.followUser(req, res, data => res.status(data.status).json(data))
  }
}

module.exports = followshipController