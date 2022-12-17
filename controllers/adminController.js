const admimServices = require('../services/admin-services')

const adminController = {
  getUsers: (req, res, next) => {
    admimServices.getUsers(req, (err, data) => err ? next(err) : res.json(data)) // 特別注意
  },
  deleteTweet: (req, res, next) => {
    admimServices.deleteTweet(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = adminController
