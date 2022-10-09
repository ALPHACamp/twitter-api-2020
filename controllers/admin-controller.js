const adminServices = require('../services/admin-services')

const adminController = {
  signIn: (req, res, next) => {
    adminServices.signIn(req, (err, data) => err
      ? next(err)
      : res.status(200).json({
        status: 'success',
        message: '成功登入',
        data
      }))
  }
}

module.exports = adminController
