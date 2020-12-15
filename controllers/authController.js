const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../models')
const User = db.User

const authController = {
  login: (req, res) => {
    const { account, password } = req.body

    if (!account || !password) {
      return res.status(400).json({
        status: 'failure',
        message: 'all fields are required'
      })
    }

    User.findOne({ where: { account } }).then(user => {
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'failure', message: 'account or password is wrong' })
      }

      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
      return res.json({
        status: 'success',
        message: `${user.name}, welcome!`,
        token,
        user
      })
    })
  },

  register: (req, res) => {
    const { account, name, email, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      return res.status(409).json({
        status: 'failure',
        message: 'Password & ConfirmPassword are different!'
      })
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
          return res.status(409).json({
            status: 'failure',
            message: `account: '${account}' has already existed!`
          })
        }
        if (user.email === email) {
          return res.status(409).json({
            status: 'failure',
            message: `email: '${email}' has already existed!`
          })
        }
      }
      return res.json({
        status: 'success',
        message: `account: '${user.account}' is registered successfully!`
      })
    })
  }
}

module.exports = authController
