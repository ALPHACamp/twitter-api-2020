const userService = require('../services/userService')
const bcrypt = require('bcryptjs')
const { User } = require('../models')

let userController = {
  signUp: (req, res) => {
    userService.signUp(req, res, (data) => {
      if (data.status === 'error') {
        res
          .status(400)
          .json({ status: data.status, message: data.message })
      } else {
        return res.json(data)
      }
    })
  },
}

module.exports = userController
