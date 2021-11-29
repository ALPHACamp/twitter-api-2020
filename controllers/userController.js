const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const jwt = require('jsonwebtoken')


const userController = {
  signUP: (req, res) => {
    if (req.body.password !== req.body.passwordCheck) {
      return res.json({ status: 'error', message: '兩次密碼輸入不同！' })
    }
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) {
          return res.json({ status: 'error', message: '信箱重複！' })
        }
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10)
        })
      })
      .then(() => {
        return res.json({ status: 'success', message: '成功註冊帳號！' })
      })
  },

  signIn: (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
      return res.json({ status: 'error', message: "required fields didn't exist" })
    }

    User.findOne({ where: { email } }).then(user => {
      if (!user) {
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

module.exports = userController