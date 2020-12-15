const db = require('../models')
const User = db.User
const { check, body, validationResult } = require('express-validator')

const registerRules = () => {
  return [
    check('account').exists({ checkFalsy: true }).withMessage('帳號不可為空'),
    check('name').exists({ checkFalsy: true }).withMessage('名稱不可為空'),
    check('account')
      .custom(async (account) => {
        const user = await User.findOne({ where: { account: account } })
        if (user) {
          throw new Error('此帳號已被註冊過')
        }
        return true
      }),
    check('email').isEmail().withMessage('信箱格式錯誤'),
    check('email')
      .custom(async (email) => {
        const user = await User.findOne({ where: { email: email } })
        if (user) {
          throw new Error('此信箱已被註冊過')
        }
        return true
      }),
    check('password').isLength({ min: 3, max: 8 }).withMessage('密碼錯誤：長度需界在 3-8 之間'),
    check('checkPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('密碼與驗證密碼不相符')
        }
        return true
      }),
  ]
}

const loginRules = () => {
  return [
    check('email').isEmail().withMessage('信箱格式錯誤'),
    check('password').isLength({ min: 3, max: 8 }).withMessage('密碼錯誤：長度需界在 3-8 之間'),
    check('email')
      .custom(async (email) => {
        const user = await User.findOne({ where: { email: email } })
        if (!user) {
          throw new Error('此信箱尚未被註冊過，請先完成註冊程序')
        }
        return true
      }),
  ]
}

const profileRules = () => {
  // it's for updating personal profile: there are two pages -> setting & edition

  const accountSetting = registerRules()
  const profileEdition = [
    check('introduction').isLength({ max: 140 }).withMessage('最多 100 字')
  ]

  if (body('page') === 'setting') return accountSetting
  else return profileEdition
}

const postTweetRules = () => {
  // it's for user posting a new tweets
  return [
    check('description').notEmpty().withMessage('發文內容不可為空'),
    check('description').isLength({ max: 140 }).withMessage('最多 140 字')
  ]
}

const validResultCheck = (req, res, next) => {
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
  validResultCheck
}

