const userService = require('../services/user-services')

const userController = {
  signIn: (req, res, next) => {
    userService.signIn(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  signUp: (req, res, next) => {
    userService.signUp(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUser: (req, res, next) => {
    userService.getUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  putUserSetting: (req, res, next) => {
    userService.putUserSetting(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  putUser: (req, res, next) => {
    userService.putUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUserTweets: (req, res, next) => {
    userService.getUserTweets(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getReplies: (req, res, next) => {
    userService.getReplies(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = userController