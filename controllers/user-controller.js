const userServices = require('../services/user-services')
const userController = {
  signIn: (req, res, next) => {
    return userServices.signIn(req, (err, data) => {
      err ? next(err) : res.json(data)
    })
  },
  signUp: (req, res, next) => {
    return userServices.signUp(req, (err, data) => {
      err ? next(err) : res.json(data)
    })
  }
}
module.exports = userController
