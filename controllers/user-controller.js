const userServices = require('../services/user-services')
const userController = {
  loginUser: (req, res, next) => {
    userServices.loginUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  registerUser: (req, res, next) => {
    userServices.registerUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUsers: (req, res, next) => {
    userServices.getUsers(req, (err, data) => err ? next(err) : res.json(data))
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => err ? next(err) : res.json(data))
  },
  getTopUsers: (req, res, next) => {
    userServices.getTopUsers(req, (err, data) => err ? next(err) : res.json(data))
  },
  editUser: (req, res, next) => {
    userServices.editUser(req, (err, data) => err ? next(err) : res.json(data))
  }
}
module.exports = userController
