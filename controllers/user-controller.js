const userServices = require('../services/user-services')

const userController = {
  signIn: (req, res, next) => {
    userServices.signIn(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  putUser: (req, res, next) => {
    userServices.putUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUserTweets: (req, res, next) => {
    userServices.getUserTweets(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getLikeTweets: (req, res, next) => {
    userServices.getLikeTweets(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getRepliedTweets: (req, res, next) => {
    userServices.getRepliedTweets(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUsersFollowings: (req, res, next) => {
    userServices.getUsersFollowings(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUsersFollowers: (req, res, next) => {
    userServices.getUsersFollowers(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = userController
