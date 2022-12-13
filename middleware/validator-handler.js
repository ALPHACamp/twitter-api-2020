const { body, check, validationResult } = require('express-validator')

//  註冊表單、更改帳戶表單驗證訊息
const accountFormValidations = [
  body('name').trim().not().isEmpty().withMessage('名字不可空白!').bail().isLength({ max: 50 }).withMessage('字數超出上限！'),
  body('account').trim().not().isEmpty().withMessage('帳號不可空白!'),
  body('email').trim().not().isEmpty().withMessage('Email不可空白').bail().isEmail().withMessage('請輸入正確Email!'),
  body('password').trim().not().isEmpty().withMessage('密碼不可空白').bail().isLength({ min: 5 }).withMessage('密碼需要大於5位!'),
  body('checkPassword').trim().not().isEmpty().withMessage('確認密碼不可空白').bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('密碼與確認密碼不相符')
      }
      return true //  沒問題務必回傳true!!
    })
]

//  驗證個人名稱、自我介紹
const userProfileFormValidations = [
  check('name').trim().not().isEmpty().withMessage('名字不可空白!').bail().isLength({ max: 50 }).withMessage('字數超出上限！'),
  check('introduction').trim().isLength({ max: 160 }).withMessage('字數超出上限！')
]

module.exports = {
  accountFormValidator: async (req, res, next) => {
    const {
      name,
      email,
      account
    } = req.body

    //  平行執行驗證
    await Promise.all(accountFormValidations.map(accountFormValidation => (
      accountFormValidation.run(req)
    )))

    //  驗證結果
    const errors = validationResult(req)

    //  結果有錯
    const message = {}
    if (!errors.isEmpty()) {
      errors.array().forEach(error => {
        switch (error.param) {
          case 'account':
            message.account = error.msg
            break
          case 'email':
            message.email = error.msg
            break
          case 'name':
            message.name = error.msg
            break
          case 'password':
            message.password = error.msg
            break
          case 'checkPassword':
            message.passwordCheck = error.msg
            break
        }
      })

      return res.status(422).json({
        status: 'error',
        message,
        email,
        account,
        name
      })
    }

    next()
  },
  userProfileFormValidator: async (req, res, next) => {
    //  平行執行驗證
    await Promise.all(userProfileFormValidations.map(userProfileFormValidation => (
      userProfileFormValidation.run(req)
    )))

    //  驗證結果
    const errors = validationResult(req)

    //  結果有錯
    const message = {}
    if (!errors.isEmpty()) {
      errors.array().forEach(error => {
        switch (error.param) {
          case 'name':
            message.name = error.msg
            break
          case 'introduction':
            message.introduction = error.msg
            break
        }
      })

      return res.status(422).json({
        status: 'error',
        message
      })
    }

    next()
  }
}
