const userServices = require('../../services/user-services')
const userController = {
  signUp: async (req, res, next) => {
    userServices.signUp(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  signIn: (req, res, next) => {
    userServices.signIn(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getUser: async (req, res, next) => {
    userServices.getUser(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getTweets: async (req, res, next) => {
    userServices.getTweets(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getRepliedTweets: async (req, res, next) => {
    userServices.getRepliedTweets(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}
module.exports = userController
