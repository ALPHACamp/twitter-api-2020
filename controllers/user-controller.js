const userServices = require('../services/user-services')

const userController = {
  signUp: (req, res, next) => {
    if (req.body.password.length < 5 || req.body.password.length > 20) throw new RangeError('密碼字數不符合規定')
    if (req.body.account.trim().length > 20) throw new RangeError('帳號字數超過上限')
    if (req.body.name.trim().length > 50) throw new RangeError('暱稱字數超過上限')

    userServices.postUser(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', message: '操作成功' }))
  },
  signIn: (req, res, next) => {
    userServices.userLogin(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', data }))
  },
  getUserProfile: (req, res, next) => {
    if (typeof Number(req.params.id) !== 'number') throw new ReferenceError('請輸入數字id 當 parameters')

    userServices.getUserProfile(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}

module.exports = userController
