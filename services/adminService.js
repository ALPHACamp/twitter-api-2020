// 載入所需套件
const { User } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminService = {
  adminLogin: async (req, res, callback) => {
    const { email, password } = req.body

    // 確認欄位是否皆有填寫
    if (!email || !password) {
      return callback({ status: 'error', message: 'email或password未填寫' })
    }

    // 檢查email＆password＆role是否為admin
    const user = await User.findOne({ where: { email } })
    if (!user || !bcrypt.compareSync(password, user.password) || user.role === 'user') {
      return callback({ status: 'error', message: '帳號不存在！' })
    }

    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET)
    return callback({
      status: 'success',
      message: '成功登入',
      token: token,
      user: {
        id: user.id, account: user.account, name: user.name, email: user.email, avatar: user.avatar, cover: user.cover, introduction: user.introduction, role: user.role
      }
    })
  }

}

// adminController exports
module.exports = adminService