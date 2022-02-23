const bcrypt = require('bcryptjs')
const validator = require('validator')
const { User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const userController = {
  signUp: async (req, res, next) => {
    try {
      const { name, account, email, password, checkPassword } = req.body
      if (!name || !account || !email || !password || !checkPassword) {
        return res.status(400).json({
          status: 'error',
          message: '資料未全部填完' 
        })
      }
      if (email && !validator.isEmail(email)) {
        return res.status(400).json({
          status: 'error',
          message: '請輸入正確信箱格式'
        })
      }
      if (password && !validator.isByteLength(password, { min: 4 })) {
        return res.status(400).json({
          status: 'error',
          message: '密碼請輸入至少 4 個!'
        })
      }
      if (password !== checkPassword) {
        return res.status(400).json({
          status: 'error',
          message: '兩次密碼不相符'
        })
      }
      if (name && !validator.isByteLength(name, { min: 0, max: 50 })) {
        return res.status(400).json({
          status: 'error',
          message: '名字長度不能超過 50 個字'
        })
      }
      if (account && !validator.isByteLength(account, { min: 0, max: 50 })) {
        return res.status(400).json({
          status: 'error',
          message: '帳號長度不能超過 50 個字'
        })
      }
      const user = await User.findOne({ where: account, role: 'user' })
      

    } catch (err) { next(err) }
  },
  signIn: async (req, res, next) => {
    res.redirect('/tweets')
  }
  
}

module.exports = userController