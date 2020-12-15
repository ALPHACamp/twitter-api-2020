const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const authController = {
  login: (req, res) => {

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
