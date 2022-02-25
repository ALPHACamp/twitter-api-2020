const followshipServices = require('../services/followship-service')

const followshipController = {
  addFollowship: (req, res, next) => {
    if (!req.body.id.trim()) throw new ReferenceError('請輸入數字 id 當 parameters')
    if (isNaN(Number(req.body.id))) throw new ReferenceError('請輸入數字 id 當 parameters')
    if (Number(req.body.id) === req.user.dataValues.id) throw new Error('使用者不可以自己追蹤自己')
    followshipServices.addFollowship(req, (err, data) => err
      ? next(err)
      : res.status(200).json({
        status: 'success',
        message: data
      }))
  },
  deleteFollowship: (req, res, next) => {
    followshipServices.deleteFollowship(req, (err, data) => err
      ? next(err)
      : res.status(200).json({
        status: 'success',
        message: data
      }))
  },
  followshipTop10: (req, res, next) => {
    followshipServices.followshipTop10(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}

module.exports = followshipController
