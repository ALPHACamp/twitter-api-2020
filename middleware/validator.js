'use strict'

const { body, validationResult } = require('express-validator')
const signUpValidator = [
  body('account')
    .trim()
    .notEmpty().withMessage('帳號不能為空白')
    .bail()
    .isLength({ max: 20 }).withMessage('帳號最多20個字'),

  body('email')
    .trim()
    .notEmpty().withMessage('信箱不能為空白')
    .bail()
    .isEmail().withMessage('必須是合法email')
    .isLength({ max: 32 }).withMessage('信箱最多32個字'),

  body('name')
    .trim()
    .notEmpty().withMessage('姓名不能為空白')
    .bail() // 第一個條件不通過 不繼續檢查
    .isLength({ max: 50 }).withMessage('姓名最多50個字'),

  body('password')
    .trim()
    .isLength({ min: 4, max: 32 })
    .withMessage('密碼長度至少4位'),

  body('checkPassword')
    .trim()
    .custom((value, { req }) => {
      // 確認密碼欄位的值需要和密碼欄位的值相符
      if (value !== req.body.password) {
        // 驗證失敗時的錯誤訊息
        throw new Error('輸入的密碼不相同')
      }
      // 成功驗證回傳 true
      return true
    }),

  (req, res, next) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      const errors = result.errors.map(e => ({
        path: e.path,
        msg: e.msg
      }))
      return res.status(400).json({ status: 'error', message: errors })
    }
    next()
  }
]

const signInValidator = [
  body('account')
    .trim()
    .notEmpty().withMessage('帳號為必填項目'),

  body('password')
    .trim()
    .notEmpty().withMessage('密碼為必填項目'),

  (req, res, next) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {
      const errors = result.errors.map(e => ({
        path: e.path,
        msg: e.msg
      }))
      return res.status(400).json({ status: 'error', message: errors })
    }
    next()
  }
]

module.exports = {
  signUpValidator,
  signInValidator
}
