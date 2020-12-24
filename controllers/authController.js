const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../models')
const User = db.User

const authController = {
  login: (req, res, next) => {
    const { account, password } = req.body

    if (!account || !password) {
      return res.status(400).json({ message: 'all fields are required' })
    }

    User.findOne({ where: { account } }).then(user => {
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ message: 'account or password is wrong' })
      }

      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
      return res.json({
        message: `${user.name}, welcome!`,
        token,
        user
      })
    }).catch(next)
  },

  register: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body

    if (!account || !name || !email || !password || !checkPassword) {
      return res.status(400).json({ message: 'all fields are required' })
    }

    if (password !== checkPassword) {
      return res.status(400).json({ message: 'Password & checkPassword are different!' })
    }

    User.findOrCreate({
      where: {
        $or: [
          { account: { $eq: account } },
          { email: { $eq: email } }
        ]
      },
      defaults: {
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      }
    }).then(([user, created]) => {
      if (!created) {
        if (user.account === account) {
          return res.status(400).json({ message: `account: '${account}' has already existed!` })
        }
        if (user.email === email) {
          return res.status(400).json({ message: `email: '${email}' has already existed!` })
        }
      }
      return res.json({ message: `account: '${user.account}' is registered successfully!` })
    }).catch(next)
  },

  getCurrentUser: (req, res, next) => {
    const currentUser = Object.fromEntries(Object.entries(req.user).slice(0, 8))
    return res.json(currentUser)
  }
}

module.exports = authController
