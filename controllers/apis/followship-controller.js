const followshipServices = require('../../services/followship-services')

const followshipController = {
  addFollowing: (req, res, next) => {
    followshipServices.addFollowing(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', messages: '已成功追隨', data }))
  },
  deleteFollowing: (req, res, next) => {
    followshipServices.deleteFollowing(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', messages: '已取消追隨', data }))
  }
}

module.exports = followshipController
