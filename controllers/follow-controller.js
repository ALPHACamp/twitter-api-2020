const followServices = require('../services/follow-services')

const followController = {
  postFollow: (req, res, next) => {
    followServices.postFollow(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  deleteFollow: (req, res, next) => {
    followServices.deleteFollow(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = followController
