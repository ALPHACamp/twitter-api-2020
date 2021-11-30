const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const db = require('../models')
const User = db.User

const adminController = {
  signIn: (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }

    User.findOne({ where: { email } }).then(user => {
      if (!user) {
        return res.json({ status: 'error', message: "no such user found" })
      }
      if (user.role !== 'admin') {
        return res.json({ status: 'error', message: "no such user found" })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res.json({ status: 'error', message: "passwords did not match" })
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      })
    })
  }
}

module.exports = adminController
