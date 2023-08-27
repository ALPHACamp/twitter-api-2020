const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { getUser } = require('../_helpers')
const userController = {
  login: (req, res, next) => {
    try {
      const userData = getUser(req).toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
      res.json({
        status: 'success',
        token,
        ...userData
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: (req, res, next) => {
    const { account, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('密碼不相符!')
    Promise.all([
      User.findOne({ where: { account } }),
      User.findOne({ where: { email } })
    ])
      .then(([user1, user2]) => {
        if (user1) throw new Error('account 已重複註冊！')
        if (user2) throw new Error('email 已重複註冊！')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(newUser => {
        res.json({
          status: 'success',
          message: '成功註冊帳號！',
          ...newUser
        })
      })
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('使用者不存在！')
        delete user.password
        delete user.role
        res.json({
          status: 'success',
          ...user
        })
      })
      .catch(err => next(err))
  }
}
module.exports = userController
