const userServices = require('../services/user-services')
const { getUser } = require('../_helpers')

const userController = {
  signUp: (req, res, next) => {
    // 帳號、密碼、信箱為註冊必填項目
    if (req.body.account === undefined || req.body.account.trim() === '') throw new Error('帳號為必填項目')
    if (req.body.email === undefined || req.body.email.trim() === '') throw new Error('信箱為必填項目')
    if (req.body.password === undefined || req.body.password.trim() === '') throw new Error('密碼為必填項目')
    // 密碼、帳號、暱稱各有其規範
    if (req.body.password.length < 5 || req.body.password.length > 20) throw new RangeError('密碼字數不符合規定')
    if (req.body.account.trim().length > 20) throw new RangeError('帳號字數超過上限')
    if (req.body.name && req.body.name.trim().length > 50) throw new RangeError('暱稱字數超過上限')

    userServices.postUser(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  signIn: (req, res, next) => {
    userServices.userLogin(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getCurrentUser: (req, res, next) => {
    userServices.getUserProfile(req, (err, data) => err ? next(err) : res.status(200).json(data))
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
  getUserFollowing: (req, res, next) => {
    userServices.getUserFollowing(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getUserFollower: (req, res, next) => {
    userServices.getUserFollower(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  getUserLike: (req, res, next) => {
    userServices.getUserLike(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  putUserProfile: (req, res, next) => {
    if (Number(req.params.id) !== getUser(req).dataValues.id) throw new Error('只能編輯自己的資料')

    if (req.body.name && req.body.name.trim().length > 50) throw new RangeError('暱稱字數超過上限')
    if (req.body.introduction && req.body.introduction.trim().length > 160) throw new RangeError('自我介紹字數超過上限')

    userServices.putUserProfile(req, (err, data) => err ? next(err) : res.status(200).json(data))
  },
  putUserAccount: (req, res, next) => {
    if (Number(req.params.id) !== getUser(req).dataValues.id) throw new Error('只能編輯自己的資料')

    if (req.body.account === undefined || req.body.account.trim() === '') throw new Error('帳號為必填項目')
    if (req.body.account.trim().length > 20) throw new RangeError('帳號字數超過上限')
    if (req.body.email === undefined || req.body.email.trim() === '') throw new Error('信箱為必填項目')
    if (req.body.password === undefined || req.body.password.trim() === '') throw new Error('密碼為必填項目')
    if (req.body.password.length < 5 || req.body.password.length > 20) throw new RangeError('密碼字數不符合規定')
    if (req.body.name && req.body.name.trim().length > 50) throw new RangeError('暱稱字數超過上限')

    userServices.putUserAccount(req, (err, data) => err ? next(err) : res.status(200).json(data))
  }
}

module.exports = userController
