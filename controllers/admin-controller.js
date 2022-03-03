const adminServices = require('../services/admin_services')

const adminController = {
  signIn: (req, res, next) => {
    adminServices.userLogin(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getTweets: (req, res, next) => {
    adminServices.getTweets(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  deleteTweet: (req, res, next) => {
    adminServices.deleteTweet(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}

module.exports = adminController
