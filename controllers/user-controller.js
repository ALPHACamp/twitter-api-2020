const userServices = require('../services/user-services')
const { getUser } = require('../_helpers')

const userController = {
  signUp: (req, res, next) => {
    if (req.body.password.length < 5 || req.body.password.length > 20) throw new RangeError('密碼字數不符合規定')
    if (req.body.account.trim().length > 20) throw new RangeError('帳號字數超過上限')
    if (req.body.name.trim().length > 50) throw new RangeError('暱稱字數超過上限')

    userServices.postUser(req, (err, data) => err ? next(err) : res.status(200).json({ status: 'success', message: '操作成功' }))
  },
  signIn: (req, res, next) => {
    // 在前台登入輸入管理員帳號(root)，則給錯誤：帳號不存在
    if (req.body.account === process.env.ADMIN_ACCOUNT) throw new Error('帳號不存在')

    userServices.userLogin(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getUserProfile: (req, res, next) => {
    userServices.getUserProfile(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getUserTweet: (req, res, next) => {
    userServices.getUserTweet(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getUserReply: (req, res, next) => {
    userServices.getUserReply(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  putUserProfile: (req, res, next) => {
    if (Number(req.params.id) !== getUser(req).dataValues.id) throw new Error('只能編輯自己的資料')

    if (req.body.name.trim().length > 50) throw new RangeError('暱稱字數超過上限')
    if (req.body.introduction.trim().length > 160) throw new RangeError('自我介紹字數超過上限')
    userServices.putUserProfile(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}

module.exports = userController
