const { User } = require('../models')
const bcrypt = require('bcryptjs')

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (!account || !name || !email || !password || !checkPassword) {
        return res.json({ status: 'error', message: '所有欄位皆為必填！' })
      } else if (checkPassword !== password) {
        return res.json({ status: 'error', message: '密碼與確認密碼不符！' })
      } else {
        const sameEmailUser = await User.findOne({ where: { email } })
        if (sameEmailUser) {
          return res.json({ status: 'error', message: '此Email已存在。' })
        }
        const sameAccountUser = await User.findOne({ where: { account } })
        if (sameAccountUser) {
          return res.json({ status: 'error', message: '此帳號已存在。' })
        }
        await User.create({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
        })
        return res.json({ status: 'success', message: '帳號註冊成功！' })
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
