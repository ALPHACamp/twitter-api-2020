const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const { User } = require('../models')
const userController = {
  signUp: (req, res, next) => {
    const { password, checkPassword, email, account, name } = req.body
    if (password !== checkPassword) throw new Error('密碼與確認密碼不相符')
    User.findOne({
      attributes: ['email', 'account'],
      where: {
        [Op.or]: [{ email }, { account }]
      }
    })
      .then(user => {
        if (!user) return bcrypt.hash(password, 10)
        if (user.email === email) throw new Error('該Email已被註冊！')
        if (user.account === account) throw new Error('該account已被註冊！')
      })
      .then(hash => User.create({
        name,
        account,
        email,
        password: hash,
        profilePhoto: 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png',
        coverPhoto: 'https://i.imgur.com/t0YRqQH.jpg'
      }))
      .then(newUser => res.json({ status: 'success', data: { user: newUser } }))
      .catch(err => next(err))
  },
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' }) // 簽發 JWT，效期為 30 天
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
