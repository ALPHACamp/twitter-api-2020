const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userService = {
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
  }
}

module.exports = userService