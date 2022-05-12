const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../../models')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      if (userData.Identity.identity === 'admin') {
        userData.is_admin = true
      } else { userData.is_admin = false }
      delete userData.password
      delete userData.Identity
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
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
  },

  signUp: async (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('驗證密碼不正確')
    const user = await User.findOne({ where: { email: req.body.email } })
    if (user) throw new Error('使用者已經存在')
    const registeredUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hash(req.body.password, 10)
    })
    const token = jwt.sign(registeredUser.password, process.env.JWT_SECRET, { expiresIn: '30d' })
    const userData = registeredUser.toJSON()
    delete userData.password

    req.login(registeredUser, err => {
      if (err) return next(err)
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    })
  }
}

module.exports = userController
