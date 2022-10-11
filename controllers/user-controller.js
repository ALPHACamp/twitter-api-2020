const jwt = require('jsonwebtoken')
const userServices = require('../services/user-services')
const userController = {
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
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
