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
    if (password !== checkPassword) throw new Error('Passwords do not match!')

    return User.findAll({
        $or: [{
            where: {
              account
            }
          },
          {
            where: {
              email
            }
          }
        ]
      })
      .then(users => {
        if (users.some(u => u.email === email)) throw new Error('email 已重複註冊！')
        if (users.some(u => u.account === account)) throw new Error('account 已重複註冊！')

        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          account,
          password: hash,
          name,
          email,
          role: ''
        })
      })
      .then(newUser => {
        const user = newUser.toJSON()
        delete user.password
        return res.status(200).json(user)
      })
      .catch(err => next(err))
  }
}

module.exports = userController