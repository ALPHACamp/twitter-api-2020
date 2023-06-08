const bcrypt = require('bcryptjs')
const { User } = require('../../models')
const jwt = require('jsonwebtoken')

const userController = {
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON()
      if (userData.role === 'admin') throw new Error('Account does not exist!')
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
      res.status(500).json({ status: 'error', error: err.message })
    }
  },
  signUp: (req, res) => {
    const { name, email, password, avatar, introduction, role, account, passwordCheck } = req.body
    new Promise((resolve, reject) => {
      if (name.length > 50) reject(new Error(`Name too long`))
      if (introduction.length > 160) reject(new Error('Introduction too long'))
      if (password != passwordCheck) reject(new Error('Password do not match'))
      resolve()
    })
      .then(() => {
        return Promise.all([
          User.findOne({ where: { email } }),
          User.findOne({ where: { account } })
        ])
      })
      .then(([user, account]) => {
        if (user) throw new Error('Email already exists!')
        if (account) throw new Error('Account already registered!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          name,
          email,
          avatar,
          introduction,
          role,
          account,
          password: hash
        })
      })
      .then((user) => {
        user = user.toJSON()
        delete user.password
        res.json({ status: 'success', data: { user } })
      })
      .catch(err => {
        res.status(500).json({ status: 'error', error: err.message })
      })
  },
}

module.exports = userController