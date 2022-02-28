const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {
  User,
  Tweet,
  Reply,
  Like
} = require('../models')
const helpers = require('../_helpers')
const sequelize = require('sequelize')

const userController = {

  signUp: (req, res, next) => {
    const {
      account,
      name,
      email,
      password,
      checkPassword
    } = req.body
    if (password !== checkPassword) throw new Error('密碼兩次輸入不同')

    // console.log(email + name)

    return Promise.all([
        User.findOne({
          where: {
            email: req.body.email
          }
        }),
        User.findOne({
          where: {
            account: req.body.account
          }
        })
      ])
      .then(([email, account]) => {
        if (email) throw new Error('email 已重複註冊！')
        if (account) throw new Error('account 已重複註冊！')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          account,
          password: hash,
          name,
          email
        })
      })
      .then(registerUser => {
        const user = registerUser.toJSON()
        delete user.password
        return res.status(200).json(user)
      })
      .catch(err => next(err))
  }
}

module.exports = userController