const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const userService = {
  signIn: (req, cb) => {
    const { account, password } = req.body
    if (!account || !password) throw new Error('account and password are required!')

    return User.findOne({
      where: { account }
    })
      .then(user => {
        if (!user) throw new Error('User not exits!')
        if (!bcrypt.compareSync(password, user.password)) throw new Error('password incorrect!')
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
        return cb(null, {
          token,
          user: userData
        })
      })
      .catch(err => cb(err))
  },
  signUp: (req, cb) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) throw new Error('Passwords do not match!')

    return User.findAll({
      $or: [
        { where: { account } },
        { where: { email } },
        { where: { name } }
      ]
    })
      .then(users => {
        if (users.some(u => u.email === email)) throw new Error('Email already exists!')
        if (users.some(u => u.account === account)) throw new Error('Account already exists!')
        if (users.some(u => u.name === name)) throw new Error('Name already exists!')

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
        return cb(null, user)
      })
      .catch(err => cb(err))
  },
  getUser: (req, cb) => {
    const userId = Number(req.params.id)
    User.findByPk(userId, {
      raw: true
    })
      .then(user => {
        if (!user) throw new Error('User not exits!')
        if (user.role === 'admin') throw new Error('User not exits!')
        delete user.password
        return cb(null, user)
      })
      .catch(err => cb(err))
  }
}

module.exports = userService