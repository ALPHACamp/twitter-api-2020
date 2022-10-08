const followshipServices = require('../services/followship-service')

const followshipController = {
  addFollowing: (req, res, next) => {
    followshipServices.addFollowing(req, (err, data) => err
      ? next(err)
      : res.status(200).json({
        status: 'success',
        message: '追蹤成功',
        data
      }))
  },
  removeFollowing: (req, res, next) => {
    followshipServices.removeFollowing(req, (err, data) => err
      ? next(err)
      : res.status(200).json({
        status: 'success',
        message: '取消追蹤',
        data
      }))
  },
  getTopFollowship: (req, res, next) => {
    followshipServices.getTopFollowship(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  }
}

module.exports = followshipController
