const userServices = require('../services/user-services')

const userController = {
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  signIn: (req, res, next) => {
    userServices.signIn(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  getTweetsOfUser: (req, res, next) => {
    userServices.getTweetsOfUser(req, (err, data) => err ? next(err) : res.json(data)) // 特別注意要是陣列
  },
  getRepliesOfUser: (req, res, next) => {
    userServices.getRepliesOfUser(req, (err, data) => err ? next(err) : res.json(data)) // 特別注意要是陣列
  },
  getLikesOfUser: (req, res, next) => {
    userServices.getLikesOfUser(req, (err, data) => err ? next(err) : res.json(data)) // 特別注意要是陣列
  },
  getFollowingsOfUser: (req, res, next) => {
    userServices.getFollowingsOfUser(req, (err, data) => err ? next(err) : res.json(data)) // 特別注意要是陣列
  },
  getFollowersOfUser: (req, res, next) => {
    userServices.getFollowersOfUser(req, (err, data) => err ? next(err) : res.json(data)) // 特別注意要是陣列
  },
  editUser: (req, res, next) => {
    userServices.editUser(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}

module.exports = userController
