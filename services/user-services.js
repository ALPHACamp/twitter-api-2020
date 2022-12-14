const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const assert = require('assert')
const { User } = require('../models')

const userServices = {
  // 使用者註冊
  signUp: (req, cb) => {
    const { account, email, password, checkPassword } = req.body
    let name = req.body.name
    // 驗證name內容是否超過上限字數，若超過則提示
    const nameLengthLimit = 50
    if (name.length > nameLengthLimit) {
      throw new Error(
      `Name的內容超過${nameLengthLimit}字, 請縮短!(${name.length}/${nameLengthLimit})`)
    }
    // 驗證兩次密碼輸入是否相符，若不符則提示錯誤訊息
    if (password !== checkPassword) throw new Error('請再次確認密碼!')
    // 若name未填，default為account
    if (!name) name = account
    // 使用者account & email在資料庫皆須為唯一，任一已存在資料庫則提示錯誤訊息
    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([userFindByAccount, userFindByEmail]) => {
        assert(!userFindByAccount, 'Account 已重複註冊!')
        assert(!userFindByEmail, 'Email 已重複註冊！')
        // input驗證OK，bcrypt密碼
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        // 建立使用者資料
        return User.create({
          account,
          name,
          email,
          password: hash
        })
      })
      .then(createdUser => cb(null, { createdUser }))
      .catch(err => cb(err))
  },
  signIn: (req, cb) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      cb(null, { token, user: userData })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = userServices
