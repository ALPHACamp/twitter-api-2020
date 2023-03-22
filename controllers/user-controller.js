const userServices = require('../services/user-services')
const adminController = {
  getTopUsers: (req, res, next) => {
    userServices.getTopUsers(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}
module.exports = adminController
