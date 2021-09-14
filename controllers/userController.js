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
      return res.status(400).json({
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
        .status(400)
        .json({ status: 'error', message: 'Incorrect password' })
    }
    // sign user token
    const payload = { id: user.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET)

    return res.status(200).json({
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
      return res.status(400).json({
        status: 'error',
        message: "Required fields didn't exist"
      })
    }

    // Check name characters
    if (name.trim().length > 50) {
      return res.status(400).json({
        status: 'error',
        message: 'The name should not exceed 50 words'
      })
    }

    // Check account format
    const regex = new RegExp(/^\w+$/)
    if (!account.match(regex)) {
      return res.status(400).json({
        status: 'error',
        message: 'The account should only include number, letter and underline'
      })
    }

    // Check if password equal to checkPassword
    if (password !== checkPassword) {
      return res.status(400).json({
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

    // Check whether the tweets exist
    if (!tweets) {
      return res
        .status(200)
        .json({ status: 'success', message: 'No tweets found' })
    }

    return res.status(200).json(tweets)
  },

  getUserRepliedTweets: async (req, res) => {
    const tweets = await userService.getUserRepliedTweets(req.params.id)

    // Check whether the tweets exist
    if (!tweets) {
      return res
        .status(200)
        .json({ status: 'success', message: 'No tweets found' })
    }

    return res.status(200).json(tweets)
  },

  getUserLikedTweets: async (req, res) => {
    const [targetUserId, currentUserId] = [
      req.params.id,
      helpers.getUser(req).id
    ]

    const tweets = await userService.getUserLikedTweets(
      targetUserId,
      currentUserId
    )

    // Check whether the tweets exist
    if (!tweets) {
      return res
        .status(200)
        .json({ status: 'success', message: 'No tweets found' })
    }

    return res.status(200).json(tweets)
  },

  getUserFollowings: async (req, res) => {
    const [targetUserId, currentUserId] = [
      req.params.id,
      helpers.getUser(req).id
    ]

    let users = await userService.getUserFollowings(targetUserId, currentUserId)

    // Check whether the users exist
    if (!users) {
      return res
        .status(200)
        .json({ status: 'success', message: 'No users found' })
    }

    // translate to boolean in isFollowed attribute
    users.forEach((user) => {
      user.isFollowed = user.isFollowed ? true : false
    })

    return res.status(200).json(users)
  },

  getUserFollowers: async (req, res) => {
    const [targetUserId, currentUserId] = [
      req.params.id,
      helpers.getUser(req).id
    ]

    let users = await userService.getUserFollowers(targetUserId, currentUserId)

    // Check whether the users exist
    if (!users) {
      return res
        .status(200)
        .json({ status: 'success', message: 'No users found' })
    }

    // translate to boolean in isFollowed attribute
    users.forEach((user) => {
      user.isFollowed = user.isFollowed ? true : false
    })

    return res.status(200).json(users)
  },

  putUser: async (req, res) => {
    const {
      account,
      name,
      email,
      password,
      checkPassword,
      cover,
      avatar,
      introduction
    } = req.body

    const errors = []

    // Check if the user is current user
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      return res.status(403).json({
        status: 'error',
        message: "Should not edit the other user's profile"
      })
    }

    // Check name characters
    if (name && name.trim().length > 50) {
      errors.push('The name should not exceed 50 words')
    }

    // Check account format
    const regex = new RegExp(/^\w+$/)
    if (account && !account.match(regex)) {
      errors.push(
        'The account should only include number, letter and underline'
      )
    }

    // Check if password equal to checkPassword
    if (checkPassword && password !== checkPassword) {
      errors.push('Password value is not equal to checkPassword')
    }

    // Check introduction characters
    if (introduction && introduction.trim().length > 160) {
      errors.push('The introduction should not exceed 160 words')
    }

    if (errors[0]) {
      return res.status(400).json({
        status: 'error',
        message: errors
      })
    }

    const user = await userService.putUser(req.params.id, req.body)

    const responseData = {
      status: 'success',
      message: 'Account info has updated',
      user: user.dataValues
    }

    return res.status(200).json(responseData)
  }
}

module.exports = userController
