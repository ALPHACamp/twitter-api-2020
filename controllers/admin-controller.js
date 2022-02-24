const bcrypt = require('bcryptjs')
const { User } = require('../models')
const jwt = require('jsonwebtoken')

const adminController = {
  login: async (req, res, next) => {
    try {
      const error = new Error()
      const { account, password } = req.body

      if (!account || !password) {
        error.code = 400
        error.message = '有欄位沒填寫到'
        throw error
      }

      const user = await User.findOne({ where: { account } }) 

      if (!user || user.role === 'user') {
        error.code = 403
        error.message = '帳號不存在'
        throw error
      }

      if (!bcrypt.compareSync(password, user.password)) {
        error.code = 403
        error.message = '帳號或密碼錯誤'
        throw error
      }

      const userData = user.toJSON()
      delete userData.password
      const token = jwt
        .sign(
          userData,
          process.env.JWT_SECRET,
          { expiresIn: '30d' }
        )
      return res.json({
        status: 'success',
        token,
        data: userData,
        message: '登入成功'
      })
    } catch (err) {
      next(err)
    }
  }
}
  
module.exports = adminController
