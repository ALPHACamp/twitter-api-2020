const { body, validationResult } = require('express-validator')

// 個人設定
const userAccountValidation = [
  body('account').trim().notEmpty().withMessage('Account cannot be empty'),
  body('name').trim().notEmpty().withMessage('Name cannot be empty').bail().isLength({ max: 50 }).withMessage('The name cannot exceed 50 characters'),
  body('email').trim().notEmpty().withMessage('Email cannot be empty').bail().isEmail().withMessage('Please enter the correct email format'),
  body('password').trim().notEmpty().withMessage('Password cannot be empty').bail().isLength({ min: 5, max: 12 }).withMessage('Password length must be between 5 and 12 characters')
]
// 個人資料
const userProfileValidation = [
  body('name').trim().notEmpty().withMessage('Name cannot be empty').bail().isLength({ max: 50 }).withMessage('The name cannot exceed 50 characters'),
  body('introduction').trim().isLength({ max: 160 }).withMessage('Self-introduction cannot exceed 160 words')
]

// 註冊表單
const signupValidation = [
  body('account').trim().notEmpty().withMessage('Account cannot be empty'),
  body('name').trim().notEmpty().withMessage('Name cannot be empty').bail().isLength({ max: 50 }).withMessage('The name cannot exceed 50 characters'),
  body('email').trim().notEmpty().withMessage('Email cannot be empty').bail().isEmail().withMessage('Please enter the correct email format'),
  body('password').trim().notEmpty().withMessage('Password cannot be empty').bail().isLength({ min: 5, max: 12 }).withMessage('Password length must be between 5 and 12 characters'),
  body('checkPassword').trim().custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Confirm password is incorrect')
    }
    return true
  })
]

// 登入表單
const signinValidation = [
  body('account').trim().notEmpty().withMessage('Account cannot be blank'),
  body('password').trim().notEmpty().withMessage('Password cannot be empty').bail().isLength({ min: 5, max: 12 }).withMessage('Password length must be between 5 and 12 characters')
]

// 推文與留言
const tweetValidation = [
  body('description').trim().notEmpty().withMessage('Tweet cannot be empty').bail().isLength({ max: 140 }).withMessage('Tweets cannot exceed 140 characters')
]

const replyValidation = [
  body('comment').trim().notEmpty().withMessage('Reply cannot be empty').bail().isLength({ max: 140 }).withMessage('The reply cannot exceed 140 characters')
]

const validateForm = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const msg = {}
    errors.array().forEach(err => {
      console.log(err)
      msg[err.param] = err.msg
    })
    return res.status(400).json({ errors: msg })
  }
  next()
}
module.exports = {
  userAccountValidation,
  userProfileValidation,
  signupValidation,
  signinValidation,
  tweetValidation,
  replyValidation,
  validateForm
}
