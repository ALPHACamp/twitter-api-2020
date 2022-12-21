const adminServices = require('../services/admin-services')
const userServices = require('../services/user-services')
const adminController = {
  loginAdmin: (req, res, next) => {
    adminServices.loginAdmin(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUsers: (req, res, next) => {
    adminServices.getUsers(req, (err, data) => err ? next(err) : res.json(data))
  },
  deleteTweet: (req, res, next) => {
    adminServices.deleteTweet(req, (err, data) => err ? next(err) : res.json(data))
  },
  getTweets: (req, res, next) => {
    userServices.getTweets(req, (err, data) => err ? next(err) : res.json(data))
  }
}
module.exports = adminController
