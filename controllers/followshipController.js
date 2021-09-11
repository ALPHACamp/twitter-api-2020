const followshipService = require('../services/followshipService')

const followshipController = {
  addFollowing: (req, res) => {
    followshipService.addFollowing(req, res, (data) => {
      if (data['status'] === 'error') {
        return res.status(401).json(data)
      }

      return res.status(200).json(data)
    })
  }
}

module.exports = followshipController
