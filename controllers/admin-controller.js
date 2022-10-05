const adminServices = require('../services/admin-services')
const adminController = {
  signIn: (req, res, next) => {
    return adminServices.signIn(req, (err, data) => {
      err ? next(err) : res.json(data)
    })
  }
}
module.exports = adminController
