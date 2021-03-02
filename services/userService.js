const db = require('../models')
const User = db.User
const bcrypt = require('bcryptjs')
const Followship = db.Followship

//JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const user = require('../models/user')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userService = {
  signUp: (req, res, callback) => {
    if (req.body.checkPassword !== req.body.password) {
      callback({ status: 'error', message: 'Password is different' })
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          callback({ status: 'error', message: 'Email is already exists' })
        } else {
          User.create({
            account: req.body.account,
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            callback({ status: 'success', message: 'User was successfully registered' })
          })
        }
      })
    }
  },
  getTopUser: (req, res, callback) => {
    User.findAll(
      {
        where: { role: 'user' },
        include: [
          { model: User, as: 'Followers' }]
      })
      .then(users => {
        console.log(req.user)
        users = users.map(user => ({
          ...user.dataValues,
          FollowerCount: user.Followers.length,
          isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
        }))
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
        callback({ users: users })
      })
  },
  getUser: (req, res, callback) => { },
  getUserTweets: (req, res, callback) => { },
  getUserReplies: (req, res, callback) => { },
  getUserLikes: (req, res, callback) => { },
  getFollowings: (req, res, callback) => { },
  getFollowers: (req, res, callback) => { },
  putUser: (req, res, callback) => { },
  editUser: (req, res, callback) => { }
}

module.exports = userService