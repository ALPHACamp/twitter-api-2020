const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models')
const userService = require('../services/userService')
const helpers = require('../_helpers')
const { joiMessageHandler, userInfoSchema } = require('../utils/validator')

const userController = {
  signIn: async (req, res) => {
    const { account, password } = req.body

    // Check request body data format with Joi schema
    const { error } = userInfoSchema.validate(req.body, { abortEarly: false })

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: joiMessageHandler(error.details)
      })
    }

    // Check whether the user exists by account
    const user = await userService.signIn(account)

    if (!user) {
      return res
        .status(401)
        .json({ status: 'error', message: 'No such user found' })
    }

    // Check user role by baseUrl
    if (!req.baseUrl.split('/')[2].includes(user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Permission denied'
      })
    }

    // Check whether the user password is correct
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
    // Check request body data format with Joi schema
    const { error } = userInfoSchema.validate(req.body, { abortEarly: false })

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: joiMessageHandler(error.details)
      })
    }

    // Call userService to create account
    const data = await userService.postUser(req.body)

    if (data['status'] === 'error') {
      return res.status(401).json(data)
    }

    // Delete password attributes in response data
    delete data.dataValues.password

    const responseData = {
      status: 'success',
      message: 'Registration success',
      user: data.dataValues
    }
    return res.status(200).json(responseData)
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
    // Check if the user is current user
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      return res.status(403).json({
        status: 'error',
        message: "Should not edit the other user's profile"
      })
    }

    // Check request body data format with Joi schema
    const { error } = userInfoSchema.validate(req.body, { abortEarly: false })

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: joiMessageHandler(error.details)
      })
    }
    
    // Update user data
    const user = await userService.putUser(req.params.id, req.body)
    delete user.dataValues.password
    const responseData = {
      status: 'success',
      message: 'Account info has updated',
      user: user.dataValues
    }

    return res.status(200).json(responseData)
  },

  getTopUsers: async (req, res) => {
    const users = await userService.getTopUsers(helpers.getUser(req).id)

    // Check whether the users exist
    if (!users) {
      return res
        .status(200)
        .json({ status: 'success', message: 'No users found' })
    }

    // translate to boolean in isFollowed attribute
    users.forEach((user) => {
      user.dataValues.isFollowed = user.dataValues.isFollowed ? true : false
    })

    return res.status(200).json(users)
  }
}

module.exports = userController
