const db = require('../models')
const { User, Tweet, Like, Reply } = db
const bcrypt = require('bcryptjs')

//JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const user = require('../models/user')
const tweetService = require('./tweetService')
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
        include: [{ model: User, as: 'Followers' }]
      })
      .then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          FollowerCount: user.Followers.length,
          isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
        }))
        users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
        callback({ users: users })
      })
  },

  getUser: (req, res, callback) => {
    User.findByPk(req.params.id, {
      where: { role: 'user' },
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(user => {
        callback(user)
      })
      .catch(err => console.log(err))
  },

  getUserTweets: (req, res, callback) => {
    Tweet.findAll({
      where: { UserId: req.params.id },
      include: [
        { model: Like },
        { model: Reply }
      ]
    })
      .then(tweets => {
        callback(tweets)
      })
      .catch(err => console.log(err))
  },
  getUserReplies: (req, res, callback) => { },
  getUserLikes: (req, res, callback) => { },
  getFollowings: (req, res, callback) => { },
  getFollowers: (req, res, callback) => { },
  putUser: (req, res, callback) => { },
  editUser: (req, res, callback) => { }
}

module.exports = userService