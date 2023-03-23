const userServices = require('../services/user-services')
const adminController = {
  postSignIn: (req, res, next) => {
    userServices.postSignIn(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getTopUsers: (req, res, next) => {
    userServices.getTopUsers(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  postSignUp: (req, res, next) => {
    userServices.postSignUp(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}
module.exports = adminController
