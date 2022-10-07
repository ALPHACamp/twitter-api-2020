const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../../models')
const helpers = require('../../_helpers')

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      if (password !== checkPassword) throw new Error('密碼輸入錯誤，請重新確認')
  
      const [ userEmail, userAccount ] = Promise.all([
        User.findOne({ where: { email } }),
        User.findOne({ where: { account }})
      ])

      if (userEmail) throw new Error('email 已重複註冊！')
      if (userAccount) throw new Error('account 已重複註冊！')
      const user = await User.create({
        account,
        name,
        email,
        password: bcrypt.hash(password, 10)
      })
      return res.json({status: 'success', data: user})
    } catch(err) {
      next(err)
    }
  },
  signIn: (req, res, next) => {
    try {
      const userData = helpers.getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({ status: 'success', data: {
        token,
        user: userData
      }})
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
