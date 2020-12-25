const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const sequelize = db.sequelize
const { check, body, param, validationResult } = require('express-validator')
const helpers = require('../_helpers.js')

const registerRules = async (req, res, next) => {
  await body('account').exists({ checkFalsy: true }).withMessage('帳號不可為空').run(req)
  await body('name').exists({ checkFalsy: true }).withMessage('名稱不可為空').run(req)
  await body('account')
    .custom(async (account, { req }) => {
      const user = await User.findOne({ where: { account: account } })
      if (helpers.getUser(req)) {
        if (helpers.getUser(req).account === account) return true
      }
      if (user) {
        throw new Error('此帳號已被註冊過')
      }
      return true
    }).run(req)
  await body('email').isEmail().withMessage('信箱格式錯誤').run(req)
  await body('email')
    .custom(async (email, { req }) => {
      const user = await User.findOne({ where: { email: email } })
      if (helpers.getUser(req)) {
        if (helpers.getUser(req).email === email) return true
      }
      if (user) {
        throw new Error('此信箱已被註冊過')
      }
      return true
    }).run(req)
  await body('password').isLength({ min: 3, max: 8 }).withMessage('密碼錯誤：長度需界在 3-8 之間').run(req)
  await body('checkPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('密碼與驗證密碼不相符')
      }
      return true
    }).run(req)

  return validResultCheck(req, res, next)
}

const loginRules = async (req, res, next) => {
  await body('email').exists({ checkFalsy: true }).withMessage('帳號不可為空').run(req)
  await body('password').isLength({ min: 3, max: 8 }).withMessage('密碼錯誤：長度需界在 3-8 之間').run(req)
  await body('email')
    .custom(async (email) => {
      const user = await sequelize.query(`SELECT * FROM Users WHERE BINARY Users.email = '${email}'`, { type: sequelize.QueryTypes.SELECT })
      if (user.length === 0) {
        throw new Error('此帳號尚未被註冊過，請先完成註冊程序')
      }
      return true
    }).run(req)

  return validResultCheck(req, res, next)
}

const profileRules = async (req, res, next) => {
  const accountSetting = () => registerRules(req, res, next)
  const profileEdition = () => Promise.all([
    body('name').exists({ checkFalsy: true }).withMessage('名稱不可為空')
      .isLength({ max: 50 }).withMessage('最多 50 字').run(req),
    body('introduction').isLength({ max: 160 }).withMessage('最多 160 字').run(req)
  ])
  if (req.body.page === 'setting') return accountSetting()
  else await profileEdition()

  return validResultCheck(req, res, next)
}

const postTweetRules = async (req, res, next) => {
  await body('description').notEmpty().withMessage('發文內容不可為空').run(req)
  await body('description').isLength({ max: 140 }).withMessage('最多 140 字').run(req)

  return validResultCheck(req, res, next)
}

const userRules = async (req, res, next) => {
  await param('id')
    .custom(async (UserId) => {
      const user = await User.findOne({ where: { id: UserId, role: null } })
      if (!user) {
        throw new Error('查無此使用者編號')
      }
      return true
    }).run(req)

  return validResultCheck(req, res, next)
}

const tweetRules = async (req, res, next) => {
  await param('id')
    .custom(async (tweetId) => {
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) {
        throw new Error('無此篇貼文')
      }
      return true
    }).run(req)

  return validResultCheck(req, res, next)
}

function validResultCheck(req, res, next) {
  const errorResults = validationResult(req)
  if (errorResults.isEmpty()) return next()

  const errors = errorResults.errors.map(error => error.msg)
  return res.status(400).json({ status: 'error', message: `${errors}` })
}


module.exports = {
  registerRules,
  loginRules,
  profileRules,
  postTweetRules,
  userRules,
  tweetRules
}
