
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const jwt = require('jsonwebtoken')

const userController = {
  login: (req, res, next) => {
    const error = new Error()
    const { account, password } = req.body

    if (!account || !password) {
      error.code = 400
      error.message = '所有欄位都要填寫'
      throw error
    }

    return User.findOne({ where: { account } })
      .then(user => {
        if (!user || user.role === 'admin') {
          error.code = 403
          error.message = '帳號不存在'
          throw error
        }

        return Promise.all([
          bcrypt.compare(password, user.password),
          user
        ])
      })
      .then(([isMatched, user]) => {
        if (!isMatched) {
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
          data: userData

        })
      })
      .catch(error => {
        error.code = 500
        next(error)
      })



  }
}

module.exports = userController
