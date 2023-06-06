const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { getUser } = require('../../_helpers')
const { User } = require('../../models')

const userController = {
  login: (req, res, next) => {
    try {
      const userData = getUser(req).toJSON()
      delete userData.password
      // if(!user) return res.json({status: 'failed'})
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token, user: userData
        }
      })
    } catch (error) {
      next(error)
    }
  },

  signUp: async (req, res, next) => {
    try {
      const errors = []
      const { name, account, email, password, checkPassword } = req.body
      // 有欄位沒有填寫 暫時的錯誤處理
      if (!name || !account || !email || !password || !checkPassword) errors.push('每個欄位都必填')
      // 密碼與確認密碼不一致
      if (password !== checkPassword) errors.push('密碼與確認密碼不一致')
      // 確認account與email是否與資料庫重複
      const [userAccount, userEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])
      if (userAccount) errors.push('account已存在')
      if (userEmail) errors.push('email已存在')
      if (errors.length) return res.json({ status: 'failed', data: errors })
      const user = await User.create({
        name,
        account,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })
      const userData = user.toJSON()
      delete userData.password
      console.log(userData)
      return res.json({ status: 'success', data: userData })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
