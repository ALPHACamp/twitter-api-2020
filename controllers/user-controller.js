const userServices = require('../services/user-services')
const userController = {
  loginUser: (req, res, next) => {
    userServices.loginUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  registerUser: (req, res, next) => {
    userServices.registerUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  getCurrentUser: (req, res, next) => {
    userServices.getCurrentUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  editUser: (req, res, next) => {
    userServices.editUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUserFollowers: (req, res, next) => {
    userServices.getUserFollowers(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUserFollowings: (req, res, next) => {
    userServices.getUserFollowings(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUserTweets: (req, res, next) => {
    userServices.getUserTweets(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUserReplies: (req, res, next) => {
    userServices.getUserReplies(req, (err, data) => err ? next(err) : res.json(data))
  },
  getLikedTweets: (req, res, next) => {
    userServices.getLikedTweets(req, (err, data) => err ? next(err) : res.json(data))
  }
}
module.exports = userController
