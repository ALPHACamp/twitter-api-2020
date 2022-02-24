const followshipServices = require('../services/followship-services')
const followshipController = {
  postFollowships: (req, res, next) => {
    followshipServices.postFollowships(req, (err, data) =>
      err ? next(err) : res.status(200).json({ status: 'success', data }))
  },
}
module.exports = followshipController
