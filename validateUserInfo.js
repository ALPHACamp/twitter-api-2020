const helpers = require('./_helpers')
const { User } = require('./models')
module.exports = {
  schema: {
    type: 'object',
    allOf: [
      {
        properties: {
          name: { type: 'string', maxLength: 15 },
          account: { type: 'string', maxLength: 10 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', maxLength: 15, minLength: 6 },
          introduction: { type: 'string', maxLength: 140 }
        },
        additionalProperties: false
      }
    ],
    errorMessage: {
      properties: {
        name: '名字長度最多 15 個字',
        account: '帳號最多 10 個字',
        email: '請輸入正確的 email',
        password: '密碼長度為 6 至 15',
        introduction: '個人介紹最多 140 字'
      }
    }
  },

  checkUserInfo: async function checkUserInfo(req, validate) {
    const { name, email, account, password, checkPassword, introduction, setting } = req.body
    if (!helpers.getUser(req) || setting) {
      if (!account || !password || !name || !email || !checkPassword) {
        return '請輸入必填項目'
      }
      if (checkPassword !== password) {
        return '兩次密碼輸入不同！'
      }
    }

    const errors = []
    validate({ name, email, account, password, introduction })
    if (validate.errors) {
      for (const error of validate.errors) {
        errors.push(error.message)
      }
    }

    if (errors.length) return errors
    if (helpers.getUser(req) && !setting) return

    const user = await User.findOne({
      where: {
        $or: { email, account }
      }
    })

    if (user) {
      if (user.email === email) {
        errors.push('信箱重複！')
      }
      if (user.account === account.trim()) {
        errors.push('帳號重複！')
      }
    }
    if (errors.length) return errors
  }
}
