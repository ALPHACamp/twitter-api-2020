const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Tweet, Like, Reply, Followship, Sequelize } = db
const { Op } = require('sequelize')

const userService = require('../services/userService')

const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  signUp: async (req, res) => {
    const { body } = req
    const { name, account, email, password, checkPassword } = body

    try {
      const data = await userService.signUp(body)
      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message,
        request_data: {
          name: name || null,
          account: account || null,
          email: email || null,
          password: password || null,
          checkPassword: checkPassword || null
        }
      })
    }
  },
  logIn: async (req, res) => {
    const { body } = req
    try {
      const data = await userService.login(body)
      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },
  getUser: async (req, res) => {
    const UserId = req.params.id
    try {
      const data = await userService.getUser('user', UserId, 'user')
      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },
  getUserTweets: async (req, res) => {
    const UserId = req.params.id
    const viewerId = req.user.id
    try {
      const data = await userService.getUserTweets('user', UserId, viewerId)
      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },
  getUserLikes: async (req, res) => {
    const UserId = req.params.id
    const viewerId = req.user.id
    try {
      const data = await userService.getUserLikes('user', UserId, viewerId)
      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },
  getUserFollowings: async (req, res) => {
    const UserId = req.params.id
    const viewerId = req.user.id
    try {
      const data = await userService.getUserFollowings('user', UserId, viewerId)
      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },
  getUserFollowers: async (req, res) => {
    const UserId = req.params.id
    const viewerId = req.user.id
    try {
      const data = await userService.getUserFollowers('user', UserId, viewerId)
      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },
  getTopUsers: async (req, res) => {
    const viewerId = req.user.id
    try {
      const data = await userService.getTopUsers('user', viewerId)
      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  putUser: async (req, res) => {
    const UserId = req.params.id
    const viewerId = req.user.id
    const { body, files } = req
    try {
      const data = await userService.putUser('user', UserId, viewerId, body, files)
      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  putUserSettings: async (req, res) => {
    const UserId = req.params.id
    const viewerId = req.user.id
    const { body } = req
    try {
      const data = await userService.putUserSettings('user', UserId, viewerId, body)
      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  getUserRepliedTweets: async (req, res) => {
    const UserId = req.params.id
    const viewerId = req.user.id
    try {
      const data = await userService.getUserRepliedTweets('user', UserId, viewerId)
      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  },

  getCurrentUser: async (req, res) => {
    const UserId = req.user.id

    try {
      const data = await userService.getUser('user', UserId, 'currentUser')
      return res.status(200).json(data)
    } catch (error) {
      return res.status(400).json({
        status: error.name,
        message: error.message
      })
    }
  }

}

module.exports = userController
