const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  register: (req, res) => {
    if (!req.body.name || !req.body.account || !req.body.email || !req.body.password || !req.body.confirmPassword) {
      return res.json({ status: 'error', message: 'All fields must be filled.' })
    } else if (req.body.password !== req.body.confirmPassword) {
      return res.json({ status: 'error', message: 'Password and confirm password must be the same.' })
    }
    User.findOne({ where: { $or: [{ email: req.body.email }, { account: req.body.account }] } })
      .then(user => {
        if (user) {
          if (user.email === req.body.email) {
            return res.json({ status: 'error', message: 'Email has been registered.' })
          } else if (user.account === req.body.account) {
            return res.json({ status: 'error', message: 'Already have the same account.' })
          }
        } else {
          User.create({
            name: req.body.name,
            account: req.body.account,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
            role: 'user'
          })
            .then(user => {
              return res.json({ status: 'success', message: 'Registration success.' })
            })
            .catch(error => res.send(String(error)))
        }
      })
      .catch(error => res.send(String(error)))
  }
}

module.exports = userController