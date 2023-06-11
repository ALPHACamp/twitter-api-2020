const followshipService = require('../services/followship-service')

const followshipController = {
  addFollowing: (req, res, next) => {
    followshipService.addFollowing(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  removeFollowing: (req, res, next) => {
    followshipService.removeFollowing(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}
module.exports = followshipController
