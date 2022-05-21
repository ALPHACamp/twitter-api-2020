const jwt = require('jsonwebtoken')
const JWTSECRET = process.env.JWT_SECRET || 'alphacamp'
const userServices = require('../services/user-services')
const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, JWTSECRET, { expiresIn: '30d' })
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
  getUserLikes: (req, res, next) => {
    userServices.getUserLikes(req, (err, userLikes) => err ? next(err) : res.json(userLikes))
  },
  getUserFollowings: (req, res, next) => {
    userServices.getUserFollowings(req, ((err, userFollowings) => err ? next(err) : res.json(userFollowings)))
  },
  getUserFollowers: (req, res, next) => {
    userServices.getUserFollowers(req, ((err, userFollowers) => err ? next(err) : res.json(userFollowers)))
  },
  putUser: (req, res, next) => {
    userServices.putUser(req, ((err, user) => err ? next(err) : res.json(user)))
  },
  addFollowing: (req, res, next) => {
    userServices.addFollowing(req, (err, addfollowing) => err ? next(err) : res.json(addfollowing))
  },
  removeFollowing: (req, res, next) => {
    userServices.removeFollowing(req, (err, removefollowing) => err ? next(err) : res.json(removefollowing))
  },
  getTopUsers: (req, res, next) => {
    userServices.getTopUsers(req, (err, gettopusers) => err ? next(err) : res.json(gettopusers))
  }
}
module.exports = userController 