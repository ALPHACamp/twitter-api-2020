const followshipServices = require('../../services/followship-service')

const followshipController = {
  postFollowship: (req, res, next) => {
    followshipServices.addFollowing(req, (err, data) => {
      if (err) {
        return next(err)
      }
      return res.status(200).json(data)
    })
  },
  deleteFollowship: (req, res, next) => {
    followshipServices.removeFollowing(req, (err, data) => {
      if (err) {
        return next(err)
      }
      return res.status(200).json(data)
    })
  }

}

module.exports = followshipController
