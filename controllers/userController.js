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
      const data = await userService.getUser('user', UserId)
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

  putUserSettings: (req, res) => {
    const UserId = Number(req.params.id)
    const viewerId = req.user.id
    if (UserId !== viewerId) {
      return res.status(400).json({
        status: 'error',
        message: 'This is not this user\'s account.'
      })
    }

    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) {
          return res.status(400).json({
            status: 'error',
            message: 'This user does not exist.'
          })
        }
        if (!req.body.account || !req.body.name || !req.body.email || !req.body.password || !req.body.checkPassword) {
          return res.status(400).json({
            status: 'error',
            message: 'Required fields missing.'
          })
        }
        if (req.body.password !== req.body.checkPassword) {
          return res.status(400).json({
            status: 'error',
            message: 'Password should be as same as checkPassword'
          })
        }

        return user.update({
          account: req.body.account,
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
        }).then(() => {
          return res.status(200).json({
            status: 'success',
            message: 'User successfully updated.',
            user: { id: UserId }
          })
        }).catch(err => {
          return res.status(400).json({
            status: 'error',
            message: err.errors[0].message
          })
        })
      })
  },

  getUserRepliedTweets: (req, res) => {
    const UserId = req.params.id
    const viewerId = req.user.id
    userService.getUserRepliedTweets(req, res, 'user', UserId, viewerId)
      .then(data => { return data })
  },

  getCurrentUser: (req, res) => {
    const currentUserId = req.user.id

    return User.findByPk(currentUserId, {
      attributes: [
        'id', 'name', 'account', 'avatar',
        [Sequelize.literal(`exists (SELECT * FROM users WHERE role = 'admin' and id = '${req.user.id}')`), 'isAdmin']
      ]
    }).then(user => {
      user.dataValues.isAdmin = Boolean(user.dataValues.isAdmin)
      return res.status(200).json(user)
    })
  }

}

module.exports = userController
