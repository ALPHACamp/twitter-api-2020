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
  }
}
module.exports = userController
