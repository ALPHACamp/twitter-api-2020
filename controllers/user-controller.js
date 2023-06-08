const jwt = require('jsonwebtoken')
const userServices = require('../services/user-services')

const userController = {
  signIn: (req, res, next) => {
    userServices.signIn(req, (err, data) => err ? next(err) : res.json({
      status: 'success',
      data
    }))
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => err ? next(err) : res.json({
      status: 'success',
      data
    }))
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => err ? next(err) : res.json({
      status: 'success',
      data
    }))
  }
}
module.exports = userController
