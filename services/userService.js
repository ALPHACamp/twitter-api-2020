// 載入所需套件
const { User } = require('../models')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')

const userService = {
  signUp: async (req, res, callback) => {
    const { account, name, email, password, checkPassword } = req.body

    // 確認欄位是否皆有填寫
    if (!account || !name || !email || !password || !checkPassword) {
      return callback({ status: 'error', message: '所有欄位皆為必填' })
    }
    // 確認密碼是否一致
    if (password !== checkPassword) {
      return callback({ status: 'error', message: '兩次密碼不相同' })
    }

    // 確認email或account是否重複
    const user = await User.findOne({ where: { [Op.or]: [{ email }, { account }] } })
    if (user) {
      if (user.email === email) {
        return callback({ status: 'error', message: 'email已重覆註冊！' })
      }
      if (user.account === account) {
        return callback({ status: 'error', message: 'account已重覆註冊！' })
      }
    } else {
      await User.create({
        account,
        email,
        name,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
      })
      return callback({ status: 'success', message: '成功註冊' })
    }
  },
}

// userController exports
module.exports = userService