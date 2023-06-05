const userServices = require('../../services/user-services')

const userController = {
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => err
      ? next(err)
      : res.json({
        status: 'success',
        message: 'success'
      }))
  }

}
module.exports = userController
