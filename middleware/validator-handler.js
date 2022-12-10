const { body, validationResult } = require('express-validator')

//  註冊表單驗證訊息
const registerValidations = [
  body('name').trim().not().isEmpty().withMessage('名字不可空白!'),
  body('account').trim().not().isEmpty().withMessage('帳號不可空白!'),
  body('email').trim().not().isEmpty().withMessage('Email不可空白').bail().isEmail().normalizeEmail().withMessage('請輸入正確Email!'),
  body('password').trim().not().isEmpty().withMessage('密碼不可空白').bail().isLength({ min: 5 }).withMessage('密碼需要大於5位!'),
  body('passwordCheck').trim().not().isEmpty().withMessage('確認密碼不可空白').bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('密碼與確認密碼不相符')
      }
      return true //  沒問題務必回傳true!!
    })
]

module.exports = {
  RegisterValidator: async (req, res, next) => {
    const {
      name,
      email,
      account
    } = req.body

    //  平行執行註冊驗證
    await Promise.all(registerValidations.map(registerValidation => (
      registerValidation.run(req)
    )))

    //  驗證結果
    let messages = validationResult(req)

    //  結果有錯
    if (!messages.isEmpty()) {
      messages = messages.array().map(error => (
        error.msg
      ))
      return res.status(422).json({
        status: 'error',
        messages,
        email,
        account,
        name
      })
    }

    next()
  }
}
