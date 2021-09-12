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

    return res.status(200).json(currentUser)
  },

  postUser: async (req, res) => {
    const { account, name, email, password, checkPassword } = req.body

    // Check required data
    if (!account || !email || !name || !password || !checkPassword) {
      return res.status(401).json({
        status: 'error',
        message: "Required fields didn't exist"
      })
    }

    // Check if password equal to checkPassword
    if (password !== checkPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Password value is not equal to checkPassword'
      })
    }

    // Call userService to create account
    const data = await userService.postUser(req.body)

    if (data['status'] === 'error') {
      return res.status(401).json(data)
    }

    return res.status(200).json(data)
  },

  getUser: async (req, res) => {
    const user = await userService.getUser(req.params.id)

    // Check whether the user exists
    if (!user) {
      return res
        .status(401)
        .json({ status: 'error', message: 'No such user found' })
    }

    return res.status(200).json(user)
  },

  getUserTweets: async (req, res) => {
    const [targetUserId, currentUserId] = [
      req.params.id,
      helpers.getUser(req).id
    ]

    const tweets = await userService.getUserTweets(targetUserId, currentUserId)

    // Check whether the user exists
    if (!tweets) {
      return res
        .status(401)
        .json({ status: 'error', message: 'No tweets found' })
    }

    return res.status(200).json(tweets)
  }
}

module.exports = userController
