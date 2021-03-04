const db = require('../models')
const { User, Tweet, Like, Reply, Followship } = db
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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

  //Oscar start here
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

  editUser: (req, res, callback) => {
    User.findByPk(req.params.id)
      .then(user => {
        const userData = user.toJSON()
        callback(userData)
      })
      .catch(err => console.log(err))
  },

  putUser: (req, res, callback) => {
    if (!req.body.name) {
      callback({ status: 'error', message: "Please insert a name for user!" })
    }
    const { file } = req
    console.log(file)

    if (file) {
      helpers.imgurUploadPromise(file, IMGUR_CLIENT_ID)
        .then(img => {
          console.log(img)
          User.findByPk(req.params.id)
            .then(user => {
              user.update({
                name: req.body.name,
                avatar: file ? img.link : user.avatar,
                cover: file ? img.link : user.cover,
                introduction: req.body.introduction
              })
              callback({ status: 'success', message: 'User profile was successfully update' })
            })
            .catch(err => console.log(err))
        })
    } else {
      User.findByPk(req.params.id)
        .then(user => {
          user.update({
            name: req.body.name,
            avatar: user.avatar,
            cover: user.cover,
            introduction: req.body.introduction
          })
          callback({ status: 'success', message: 'User profile was successfully update' })
        })
        .catch(err => console.log(err))
    }

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

  getUserReplies: (req, res, callback) => {
    Reply.findAll({
      where: { UserId: req.params.id },
      include: [
        { model: Tweet, include: [{ model: Like }, { model: Reply }] }
      ]
    }).then(replies => {
      callback(replies)
    })
      .catch(err => console.log(err))
  },

  //Wei start here
  getUserLikes: (req, res, callback) => {
    Like.findAll({
      where: { UserId: req.params.id },
      include: [
        { model: Tweet, include: [{ model: Like }, { model: Reply }] }
      ]
    }).then(likes => {
      callback(likes)
    })
      .catch(err => console.log(err))
  },
  getFollowings: (req, res, callback) => {

    User.findByPk(req.params.id,
      {
        include: [
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ],
      }).then(users => {
        users = users.Followings
        callback(users)
      })

  },
  getFollowers: (req, res, callback) => {
    // Followship.create({ followerId: 3, followingId: 1 })
    User.findByPk(req.params.id,
      {
        include: [
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ],
      }).then(users => {
        users = users.Followers
        callback(users)
      })
  }
}

module.exports = userService