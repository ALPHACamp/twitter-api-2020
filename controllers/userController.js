const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models')
const userService = require('../services/userService')
const helpers = require('../_helpers')

const userController = {
  signIn: async (req, res) => {
    const { account, password } = req.body
    // Check required data
    if (!account || !password) {
      return res.json({
        status: 'error',
        message: "Required fields didn't exist"
      })
    }
    // Check whether the user exists by email
    const user = await userService.signIn(account)

    if (!user) {
      return res
        .status(401)
        .json({ status: 'error', message: 'No such user found' })
    }
    // Check if the user password is correct
    if (!bcrypt.compareSync(password, user.password)) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Incorrect password' })
    }
    // sign user token
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET)

    return res.json({
      status: 'success',
      message: 'Success to login',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  },

  getCurrentUser: async (req, res) => {
    const currentUser = await userService.getCurrentUser(
      helpers.getUser(req).id
    )

    // Check whether the current user exists by user id
    if (!currentUser) {
      return res
        .status(401)
        .json({ status: 'error', message: 'No such user found' })
    }

    return res
      .status(200)
      .json(currentUser)
  }
}

module.exports = userController
