const bcrypt = require('bcryptjs')
const { User } = require('../models')

const userController = {
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (password !== checkPassword) {
      const err = new Error("Password don't match")
      err.status = 403
      throw err
    }

    User.findOne({ where: { email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')

        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash
      }))
      .then(user => {
        const userData = user.toJSON()
        delete userData.password
        return res.json({ status: 'success', user: userData })
      })
      .catch(err => next(err))
  }
}

module.exports = userController
