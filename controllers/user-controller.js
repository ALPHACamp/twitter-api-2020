const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

const userController = {
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body

    if (password !== checkPassword) throw new Error('Password do not match!')

    User.findOne({ where: { [Op.or]: [{ account }, { email }] } })
      .then(user => {
        if (user) throw new Error('account or email already exists!')

        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash
      }))
      .then(() => res.json({
        status: 'success'
      }))
      .catch(err => next(err))
  }
}

module.exports = userController
