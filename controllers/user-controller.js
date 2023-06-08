const userDummy = require('./dummy/users-dummy.json')
const { User } = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const userController = {
  getUsers: (req, res, next) => {
    console.log('users_getUsers')
    res.json(userDummy.getUsers)
  },
  getUser: (req, res, next) => {
    console.log('users_getUser')
    res.json(userDummy.getUser)
  },
  getTopUsers: (req, res, next) => {
    console.log('users_getTopUser')
    res.json(userDummy.getTopUsers)
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, passwordCheck } = req.body
    if (password !== passwordCheck) throw new Error('Password do not match!')
    return User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash,
        avatar: 'https://i.imgur.com/V4RclNb.png',
        banner: 'https://i.imgur.com/ZFz8ZEI.png',
        role: 'user'
      }))
      .then(signUpUser => {
        res.status(200).json({ status: 'Accept', signUpUser })
      })
      .catch(err => next(err))
  },
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
      // JWT (A, B, C)
      // A: payload, 要打包的資訊; B: 密鑰, 使用.env來寫; C: 設定, 這邊設定有效天數
      // process.env.JWT_SECRET
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'Accept',
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
