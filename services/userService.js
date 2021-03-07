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
      callback({ status: 'error', message: 'Password is different', statusCode: 400 })
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          callback({ status: 'error', message: 'Email is already exists', statusCode: 400 })
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
  signIn: (req, res, callback) => {
    if (!req.body.email || !req.body.password) {
      callback({ status: 'error', message: "required fields didn't exist", statusCode: 400 })
    }

    const { email, password } = req.body
    User.findOne({ where: { email: email } }).then(user => {
      if (!user) return callback({ status: 'error', message: "user not found", statusCode: 401 })
      if (!bcrypt.compareSync(password, user.password)) return callback({ status: 'error', message: "password is not correct", statusCode: 401 })
      //簽發token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET) //之後寫入dotenv
      callback({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      })
    })
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
  getUser: async (req, res, callback) => {
    try {
      const user = await User.findByPk(req.params.id, {
        where: { role: 'user' },
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })
      callback(user)
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'Internal Server Error', statusCode: 500 })
    }
  },

  editUser: async (req, res, callback) => {
    try {
      const user = await User.findByPk(req.params.id)
      const userData = user.toJSON()
      callback(userData)
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'Internal Server Error', statusCode: 500 })
    }
  },

  putUser: async (req, res, callback) => {
    try {
      if (!req.body.name) {
        callback({ status: 'error', message: "Please insert a name for user!", statusCode: 400 })
      }
      const { files } = req

      if (files) {
        if (files.length === 1) {
          const img = await helpers.imgurUploadPromise(files[0], IMGUR_CLIENT_ID)
          if (files[0].fieldname === 'avatar') {
            const user = await User.findByPk(req.params.id)
            await user.update({
              name: req.body.name,
              avatar: img.link,
              cover: user.cover,
              introduction: req.body.introduction
            })
            callback({ status: 'success', message: 'User avatar was successfully update' })

          } else {
            const user = await User.findByPk(req.params.id)
            await user.update({
              name: req.body.name,
              avatar: user.avatar,
              cover: img.link,
              introduction: req.body.introduction
            })
            callback({ status: 'success', message: 'User cover was successfully update' })

          }
        } else {
          const img1 = await helpers.imgurUploadPromise(files[0], IMGUR_CLIENT_ID)
          const img2 = await helpers.imgurUploadPromise(files[1], IMGUR_CLIENT_ID)
          const user = await User.findByPk(req.params.id)
          await user.update({
            name: req.body.name,
            avatar: img1.link,
            cover: img2.link,
            introduction: req.body.introduction
          })
          callback({ status: 'success', message: 'User avatar & cover was successfully update' })
        }
      } else {
        const user = await User.findByPk(req.params.id)
        await user.update({
          name: req.body.name,
          avatar: user.avatar,
          cover: user.cover,
          introduction: req.body.introduction
        })
        callback({ status: 'success', message: 'User profile was successfully update' })
      }
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'Internal Server Error', statusCode: 500 })
    }
  },

  getUserTweets: async (req, res, callback) => {
    try {
      const tweets = await Tweet.findAll({
        where: { UserId: req.params.id },
        include: [
          { model: Like },
          { model: Reply }
        ]
      })
      callback(tweets)
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'Internal Server Error', statusCode: 500 })
    }
  },

  getUserReplies: async (req, res, callback) => {
    try {
      const replies = await Reply.findAll({
        where: { UserId: req.params.id },
        include: [
          { model: Tweet, include: [{ model: Like }, { model: Reply }] }
        ]
      })
      callback(replies)
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'Internal Server Error', statusCode: 500 })
    }
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
      }).then(user => {
        user = user.Followings.map(user => ({
          ...user.dataValues,
          followerId: user.Followship.followerId,
          followingId: user.Followship.followingId
        }))
        callback(user)
      })

  },
  getFollowers: (req, res, callback) => {
    User.findByPk(req.params.id,
      {
        include: [
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ],
      }).then(user => {
        user = user.Followers.map(user => ({
          ...user.dataValues,
          followerId: user.Followship.followerId,
          followingId: user.Followship.followingId
        }))
        callback(user)
      })
  }
}

module.exports = userService