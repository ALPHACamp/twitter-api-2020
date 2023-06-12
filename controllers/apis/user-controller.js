const userServices = require('../../services/user-services')

const userController = {
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => err ? next(err) : res.json(data))
  },
  signIn: (req, res, next) => {
    userServices.signIn(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUserTweets: (req, res, next) => {
    userServices.getUserTweets(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUserRepliedTweets: (req, res, next) => {
    userServices.getUserRepliedTweets(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUserLikesTweets: (req, res, next) => {
    userServices.getUserLikesTweets(req, (err, data) => err ? next(err) : res.json(data))
  },
  putUser: (req, res, next) => {
    userServices.putUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  putAccount: (req, res, next) => {
    userServices.putAccount(req, (err, data) => err ? next(err) : res.json(data))
  },
  getFollowers: (req, res, next) => {
    userServices.getFollowers(req, (err, data) => err ? next(err) : res.json(data))
  },
  getFollowings: (req, res, next) => {
    userServices.getFollowings(req, (err, data) => err ? next(err) : res.json(data))
  },
  getTopTenUsers: (req, res, next) => {
    userServices.getTopTenUsers(req, (err, data) => err ? next(err) : res.json(data))
  }
}
module.exports = userController
