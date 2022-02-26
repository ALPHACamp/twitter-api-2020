const adminServices = require('../services/admin_services')

const adminController = {
  signIn: (req, res, next) => {
    // 在後台登入輸入非管理員帳號(root)，則給錯誤：帳號不存在
    if (req.body.account !== process.env.ADMIN_ACCOUNT) throw new Error('帳號不存在')

    adminServices.userLogin(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}

module.exports = adminController
