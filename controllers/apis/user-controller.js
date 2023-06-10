const userServices = require('../../services/user-services')
const jwt = require('jsonwebtoken')
const passport = require('../../config/passport')

const userController = {
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'success'
      }))
  },
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      // sign JWT with 30 days validation
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          role: userData.role
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => err
      ? next(err)
      : res.json(data))
  },
  getUserTweets: (req, res, next) => {
    userServices.getUserTweets(req, (err, data) => err
      ? next(err)
      : res.json(data))
  },
  getUserRepliedTweets: (req, res, next) => {
    userServices.getUserRepliedTweets(req, (err, data) => err
      ? next(err)
      : res.json(data))
  },
  getUserLikesTweets: (req, res, next) => {
    userServices.getUserLikesTweets(req, (err, data) => err
      ? next(err)
      : res.json(data))
  },
  putUser: (req, res, next) => {
    userServices.putUser(req, (err, data) => err
      ? next(err)
      : res.json(data))
  },
  putAccount: (req, res, next) => {
    userServices.putAccount(req, (err, data) => err
      ? next(err)
      : res.json(data))
  },
  getFollowers: (req, res, next) => {
    userServices.getFollowers(req, (err, data) => err
      ? next(err)
      : res.json(data))
  }
  // for JWT test purpose
  /* getUser: (req, res, next) => {
    console.log('get user')
  } */

}
module.exports = userController
