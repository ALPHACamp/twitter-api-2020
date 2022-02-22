const userServices = require('../services/user-services')

const userController = {
  signUp: (req, res, next) => {
    userServices.postUser(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', message: '操作成功' }))
  },
  signIn: (req, res, next) => {
    userServices.userLogin(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  }
}

module.exports = userController
