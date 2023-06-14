const { use } = require('chai')
const userServices = require('../services/user-services')

const userController = {
  signUp: async (req, res, next) => {
    await userServices.signUp(req, (err, data) => err ? next(err) : res.json(data))
  },
  signIn: async (req, res, next) => {
    await userServices.signIn(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUser: async (req, res, next) => {
    await userServices.getUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUserTweets: async (req, res, next) => {
    await userServices.getUserTweets(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUserRepliedTweets: async (req, res, next) => {
    await userServices.getUserRepliedTweets(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUserLikes: async (req, res, next) => {
    await userServices.getUserLikes(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUserFollowings: async (req, res, next) => {
    await userServices.getUserFollowings(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUserFollowers: async (req, res, next) => {
    await userServices.getUserFollowers(req, (err, data) => err ? next(err) : res.json(data))
  },
  editUser: async (req, res, next) => {
    await userServices.editUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  putUser: async (req, res, next) => {
    await userServices.putUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  getTopUsers: async (req, res, next) => {
    await userServices.getTopUsers(req, (err, data) => err ? next(err) : res.json(data))
  },
  addFollowing: async (req, res, next) => {
    await userServices.addFollowing(req, (err, data) => err ? next(err) : res.json(data))
  },
  removeFollowing: async (req, res, next) => {
    await userServices.removeFollowing(req, (err, data) => err ? next(err) : res.json(data))
  }
}
module.exports = userController
