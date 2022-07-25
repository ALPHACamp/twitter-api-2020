const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')

const userController = {
  signUp: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body

    if (!account || !name || !email || !password || !checkPassword) {
      return res.json({ status: 'error', message: 'account, name, email, password, checkPassword 均需填寫' })
    }

    if (password !== checkPassword) {
      return res.json({ status: 'error', message: 'password, checkPassword 不一致' })
    }

    User.findOne({ where: { email: email } })
      .then(user => {
        if (user) {
          return res.json({ status: 'error', message: 'email 已經註冊' })
        }
        User.create({
          account: account,
          name: name,
          email: email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
          role: 'user'
        })
          .then(user => {
            return res.json({ status: 'success', message: '' })
          })
      })
  },
}

module.exports = userController
