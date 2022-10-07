const { User } = require('../models')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userController = {
  signin: (req, res, next) => {
    try {
      delete req.user.password
      // sign a token (payload + key)
      const token = jwt.sign(req.user.toJSON(), process.env.JWT_SECRET, { expiresIn: '30d' })

      res.json({
        status: 'success',
        data:
          {
            token,
            user: req.user
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
        if (!created) {
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
  }
}

module.exports = userController
