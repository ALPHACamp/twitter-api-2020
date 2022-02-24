const bcrypt = require('bcryptjs')
const { User } = require('../models')
const jwt = require('jsonwebtoken')

const adminController = {
  login: async (req, res, next) => {
    try {
      const { account, password } = req.body

      if (!account || !password) {
        return res.json({
          status: '400',
          message: '有欄位沒填寫到'
        })
      }

      const user = await User.findOne({ where: { account } }) 

      if (!user) return res.status(403).json({
        status: '403',
        message: '帳號不存在'
      })

      if (!bcrypt.compareSync(password, user.password)) return res.status(403).json({
        status: '403',
        message: '帳號或密碼錯誤'
      })

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
        data: userData

      })
    } catch (err) {
      next(err)
    }
  }
}
  
module.exports = adminController
