const adminServices = require('../services/admin-services')
const jwt = require('jsonwebtoken')
const adminController = {
  signIn: (req, res, next) => {
    adminServices.signIn(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}
module.exports = adminController