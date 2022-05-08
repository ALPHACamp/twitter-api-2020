const userServices = require('../services/user-services')

const userController = {
  register: (req, res, next) => {
    userServices.register(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}
module.exports = userController
