const { User } = require('../models')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')

const userController = {
  signin: (req, res, next) => {
    try {
      const user = helpers.getUser(req).toJSON()
      // sign a token (payload + key)
      if (user?.role === 'admin') throw new Error('此帳號不存在')
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
      delete user.password
      console.log(user)
      res.json({
        status: 'success',
        data:
          {
            token,
            user
          }
      })
    } catch (error) {
      next(error)
    }
  },
  signup: (req, res, next) => {
    const { name, email, password, checkPassword, account } = { ...req.body }
    if (!name || !email || !password || !checkPassword || !account) throw new Error('所有欄位皆須填寫')

    if (name.length > 50) throw new Error('名稱的字數超過上限 50 個字!')
    if (password !== checkPassword) throw new Error('密碼與重新輸入密碼不相符!')
    delete req.body.checkPassword
    return User.findOrCreate({
      where: {
        [Op.or]: [{ email: email }, { account: account }]
      },
      defaults: {
        ...req.body,
        password: bcrypt.hashSync(password, 10)
      }
    })
      .then(([user, created]) => {
        if (!created && user) {
          res.status(404).json({
            status: 'error',
            message: 'Error: account 已重複註冊、或 email 已重複註冊！',
            data: req.body
          })
        }

        res.status(200).json({
          status: 'success',
          message: '註冊成功、請先登入',
          data: user
        })
      })
      .catch(error => next(error))
  },
  getUser: (req, res, next) => {
    const id = Number(req.params.id)
    return User.findByPk(id, { raw: true })
      .then(user => {
        if (user?.role === 'admin') throw new Error('此帳號不存在')
        delete user.password
        res.status(200).json(user)
      })
      .catch(error => next(error))
  }
}

module.exports = userController
