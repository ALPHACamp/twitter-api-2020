const jwt = require('jsonwebtoken')
const { User, Tweet } = require('../models')
const userServices = require('../services/user-services')
const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({ status: 'success', token, user: userData })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, user) => err ? next(err) : res.json(user))
  },
  getUserTweets: (req, res, next) => {
    userServices.getUserTweets(req, (err, tweets) => err ? next(err) : res.json(tweets))
  },
  getUserRepliedTweets: (req, res, next) => {
    userServices.getUserRepliedTweets(req, (err, repliedTweets) => err ? next(err) : res.json(repliedTweets))
  },
  addFollowing: (req, res, next) => {
    userServices.addFollowing(req, (err, addfollowing) => err ? next(err) : res.json(addfollowing))
  },
  removeFollowing: (req, res, next) => {
    userServices.removeFollowing(req, (err, removefollowing) => err ? next(err) : res.json(removefollowing))
  }
}
module.exports = userController 