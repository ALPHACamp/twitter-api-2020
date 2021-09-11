const validator = require('validator')
const db = require('../models')
const User = db.User

module.exports = {
  registerCheck: async (req) => {
    const { name, account, email, password, checkPassword } = req.body
    const message = []

    // 所有欄位不能為空值
    if (!name || !account || !email || !password || !checkPassword) {
      message.push({ error: 'All column are required.' })
    }
    // email 格式需正確
    if (email && !validator.isEmail(email)) {
      message.push({ error: 'Incorrect email format.' })
    }
    // password 與 checkPassword 需相等
    if (password !== checkPassword) {
      message.push({ error: 'Password and checkPassword do not match.' })
    }

    // account 與 email 不能重複
    const user = await User.findOne({
      attributes: ['email', 'account'],
      $or: [{ where: { email } }, { where: { account } }],
    })
    if (user) {
      if (user.email === email) {
        message.push({ error: 'Email is exists.' })
      }
      if (user.account === account) {
        message.push({ error: 'Account is exists.' })
      }
    }
    if (message.length > 0) {
      return message
    }
  },
}
