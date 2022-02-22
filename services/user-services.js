const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const { User } = require('../models')

const userServices = {
  postUser: (req, cb) => {
    return User.findOne({
      where: {
        [Op.or]: [
          { email: req.body.email },
          { account: req.body.account }
        ]
      },
      raw: true,
      nest: true
    })
      .then(user => {
        if (user) {
          if (user.email === req.body.email) {
            throw new Error('信箱已被註冊過')
          } else {
            throw new Error('帳號已被註冊過')
          }
        }
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        name: req.body.name,
        account: req.body.account,
        email: req.body.email,
        password: hash
      }))
      .then(user => {
        delete user.dataValues.password
        return cb(null, { user })
      })
      .catch(err => cb(err))
  },
  userLogin: (req, cb) => {
    const userData = req.user.toJSON()
    try {
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      return cb(null, { token })
    } catch (err) {
      cb(err)
    }
  }
}

module.exports = userServices
