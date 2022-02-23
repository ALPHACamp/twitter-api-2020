const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../../models')
const TOKEN_EXPIRES = process.env.TOKEN_EXPIRES || '30m'

const userController = {
  signUp: async (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    try {
      if (!account || !email || !password || !checkPassword) throw new Error('account, email, password, checkPassword is require!')
      if (password !== checkPassword) throw new Error('Password do not match!')
      const userAccountExisted = await User.findOne({ where: { account } })
      if (userAccountExisted) throw new Error('Account already exists!')
      const userEmailExisted = await User.findOne({ where: { email } })
      if (userEmailExisted) throw new Error('Email already exists!')
      const hash = await bcrypt.hash(password, await bcrypt.genSalt(10))
      const user = await User.create({
        account,
        name,
        email,
        password: hash,
        role: 'user'
      })
      delete user.password
      res.json({
        status: 'success',
        data: {
          user
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signIn: (req, res, next) => {
    const userData = req.user.toJSON()
    try {
      // 非使用者不能登入前台
      if (userData.role !== 'user') throw new Error('Account or Password is wrong!')
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
