const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const db = require('../models')
const User = db.User

const adminService = {
  signIn: (req, res, callback) => {
    if (!req.body.email || !req.body.password) {
      return callback({ status: 'error', message: '所有欄位皆為必填！' })
    }

    const username = req.body.email
    const password = req.body.password

    return User.findOne({ where: { email: username } }).then(user => {
      if (!user) return callback({ status: 'error', message: '帳號不存在或密碼錯誤！' })
      if (!bcrypt.compareSync(password, user.password)) {
        return callback({ status: 'error', message: '帳號不存在或密碼錯誤！' })
      }
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return callback({
        status: 'success',
        message: '登入成功！',
        token: token,
        user: {
          id: user.id,
          account: user.account,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    })
  }
}

module.exports = adminService
