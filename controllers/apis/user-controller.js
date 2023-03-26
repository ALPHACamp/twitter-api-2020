const userService = require('../../services/user-services')

const userController = {
  signUp: (req, res, next) => {
    userService.signUp(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  signIn: (req, res, next) => {
    userService.signIn(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUser: (req, res, next) => {
    userService.getUser(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getTweetsOfUser: (req, res, next) => {
    userService.getTweetsOfUser(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getRepliesOfUser: (req, res, next) => {
    userService.getRepliesOfUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  getLikesOfUser: (req, res, next) => {
    userService.getLikesOfUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  getFollowingsOfUser: (req, res, next) => {
    userService.getFollowingsOfUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  getFollowersOfUser: (req, res, next) => {
    userService.getFollowersOfUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  getTopUsers: (req, res, next) => {
    userService.getTopUsers(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  editUser: (req, res, next) => {
    userService.editUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  editSettingofUser: (req, res, next) => {
    userService.editSettingofUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = userController
