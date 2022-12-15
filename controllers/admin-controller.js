const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

const adminController = {
  signIn: (req, res, next) => {
    const { account, password } = req.body
    if (!account || !password) throw new Error('account and password are required')

    return User.findOne({ where: { account, role: 'admin' }, raw: true })
      .then(user => {
        if (!user) {
          throw new Error('帳號不存在!')
        }
        const isValidPassword = bcrypt.compareSync(password, user.password)

        if (!isValidPassword) {
          throw new Error('密碼錯誤!')
        }
        const UserId = { id: user.id }
        const token = jwt.sign(UserId, process.env.JWT_SECRET, {
          expiresIn: '30d'
        })
        delete user.password
        return res.status(200).json({ success: true, token, user })
      })
      .catch(err => next(err))
  }

}

module.exports = adminController
