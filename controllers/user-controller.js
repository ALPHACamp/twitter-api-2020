const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../models')

const { User } = db

// const cb = (err, data) => err ? next(err) : res.json({ status: 'success', data })

const userController = {
  // signUpPage: (req, res) => {
  //   res.send('signup page')
  // },
  register: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    Promise.all([
      User.findOne({ where: { account: req.body.account } }),
      User.findOne({ where: { email: req.body.email } })
    ])
      .then(([userByAccount, userByEmail]) => {
        if (userByAccount) throw new Error('Account already exists!')
        if (userByEmail) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash,
        role: 'user'
      }))
      .then(newUser => {
        const data = { user: newUser }
        res.json({ status: 'success', data })
      })
      .catch(err => next(err))
  },
  login: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      delete userData.password
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
  }
}
module.exports = userController
