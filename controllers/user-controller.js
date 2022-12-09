const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const { User } = require('../models')

const userController = {
  register: async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const errorMessage = errors.errors.map(e => e.msg)
        throw new Error(errorMessage)
      }
      const { name, account, email, password } = req.body
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      let registeredUser = await User.create({ name, account, email, password: hash })
      registeredUser = registeredUser.toJSON()
      delete registeredUser.password
      res.json({ status: 'success', data: registeredUser })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
