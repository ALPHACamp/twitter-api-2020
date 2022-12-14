const jwt = require('jsonwebtoken')
const { User } = require('../models')
const bcrypt = require('bcryptjs')

const userServices = {
  signUp: (req, cb) => {
    if (req.body.password !== req.body.checkPassword) {
      throw new Error('密碼不一致 !')
    }

    const { account, name, email, password } = req.body

    User.findOne({ where: { email }, raw: true })
      .then(user => {
        if (!user) return bcrypt.hash(password, 10)

        if (user.account === account) throw new Error('account 已重複註冊！')
        if (user.email === email) throw new Error('email 已重複註冊！')
      })
      .then(hash =>
        User.create({
          account,
          name,
          email,
          password: hash
        })
      )
      .then(newUser => cb(null, { success: 'true', user: newUser }))
      .catch(err => cb(err))
  },
  signIn: (req, cb) => {
    const { account, password } = req.body
    User.findOne({ where: { account }, raw: true })
      .then(user => {
        if (!user) {
          throw new Error('帳號不存在 ！')
        }
        const isValidPassword = bcrypt.compareSync(password, user.password)

        if (!isValidPassword) {
          throw new Error('帳號不存在 ！')
        }
      })
      .then(() => {
        const userData = req.user.toJSON()
        const token = jwt.sign(userData, process.env.JWT_SECRET, {
          expiresIn: '30d'
        })

        delete userData.password

        return [userData, token]
      })
      .then(([userData, token]) =>
        cb(null, { success: 'true', data: { token, user: userData } })
      )
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    User.findByPk(req.params.id)
      .then(user => {
        if (!user) throw new Error('使用者不存在 !')
        return cb(null, { success: 'true', data: user })
      })
      .catch(err => cb(err))
  }
}

const userController = {
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => (err ? next(err) : res.json(data)))
  },
  signIn: (req, res, next) => {
    userServices.signIn(req, (err, data) => (err ? next(err) : res.json(data)))
  },
  getUser: (req, res, next) => {
    userServices.getUser(req, (err, data) => (err ? next(err) : res.json(data)))
  }
}

module.exports = userController
