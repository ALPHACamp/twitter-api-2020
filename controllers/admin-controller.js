const adminServices = require('../services/admin-services')

const adminController = {
  signIn: (req, res, next) => {
    adminServices.signIn(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getAdminTweets: (req, res, next) => {
    adminServices.getAdminTweets(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}

module.exports = adminController