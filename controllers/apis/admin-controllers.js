const adminServices = require('../../services/admin-services')

const adminController = {
  signIn: async (req, res, next) => {
    adminServices.signIn(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getUsers: async (req, res, next) => {
    adminServices.getUsers(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getTweets: async (req, res, next) => {
    adminServices.getTweets(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  deleteTweet: async (req, res, next) => {
    adminServices.deleteTweet(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}

module.exports = adminController
