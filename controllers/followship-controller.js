const followshipServices = require('../services/followship-services')

const followshipController = {
  followSomeone: (req, res, next) => {
    followshipServices.followSomeone(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  unfollowSomeone: (req, res, next) => {
    followshipServices.unfollowSomeone(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}
module.exports = followshipController
