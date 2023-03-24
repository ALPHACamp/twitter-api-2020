const userServices = require('../services/user-services')
// const { getUser } = require('../_helpers')
const db = require('../models')
// const { getTweet } = require('../services/user-services')
const { User } = db
const adminController = {
  postSignIn: (req, res, next) => {
    userServices.postSignIn(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getTopUsers: (req, res, next) => {
    userServices.getTopUsers(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  postSignUp: (req, res, next) => {
    userServices.postSignUp(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error('使用者不存在')
        // const userJson = { ...user.toJSON() }
        res.json(user)
      })
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    userServices.getUserTweets(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}
module.exports = adminController
