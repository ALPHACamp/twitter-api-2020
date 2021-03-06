const db = require('../../models')
const User = db.User
const bcrypt = require('bcryptjs')
const userService = require('../../services/userService')

//JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userController = {
  signUp: (req, res) => {
    userService.signUp(req, res, (data) => {
      if (data.status === 'error') return res.status(data.statusCode).json(data)
      return res.json(data)
    })
  },
  signIn: (req, res) => {
    userService.signIn(req, res, (data) => {
      if (data.status === 'error') return res.status(data.statusCode).json(data)
      return res.json(data)
    })
  },
  getTopUser: (req, res) => {
    userService.getTopUser(req, res, (data) => {
      return res.json(data)
    })
  },
  getUser: (req, res) => {
    userService.getUser(req, res, (data) => {
      return res.json(data)
    })
  },
  editUser: (req, res) => {
    userService.editUser(req, res, (data) => {
      return res.json(data)
    })
  },
  putUser: (req, res) => {
    userService.putUser(req, res, (data) => {
      return res.json(data)
    })
  },
  getUserTweets: (req, res) => {
    userService.getUserTweets(req, res, (data) => {
      return res.json(data)
    })
  },
  getUserReplies: (req, res) => {
    userService.getUserReplies(req, res, (data) => {
      return res.json(data)
    })
  },
  getUserLikes: (req, res) => {
    userService.getUserLikes(req, res, (data) => {
      return res.json(data)
    })
  },
  getFollowings: (req, res) => {
    userService.getFollowings(req, res, (data) => {
      return res.json(data)
    })
  },
  getFollowers: (req, res) => {
    userService.getFollowers(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = userController