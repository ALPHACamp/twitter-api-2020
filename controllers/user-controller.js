const userServices = require('../services/user-services')

const userController = {
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  signIn: (req, res, next) => {
    userServices.signIn(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getTweets: (req, res, next) => {
    return userServices.getTweets(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getUser: (req, res, next) => {
    return userServices.getUser(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  putUser: (req, res, next) => {
    return userServices.putUser(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getRepliedTweets: (req, res, next) => {
    return userServices.getRepliedTweets(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getLikes: (req, res, next) => {
    return userServices.getLikes(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getFollowings: (req, res, next) => {
    userServices.getFollowings(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getFollowers: (req, res, next) => {
    userServices.getFollowers(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}
module.exports = userController
