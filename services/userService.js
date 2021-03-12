const db = require('../models')
const { User, Tweet, Like, Reply } = db
const bcrypt = require('bcryptjs')
const sequelize = require('sequelize')
const helpers = require('../_helpers')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

//JWT
const jwt = require('jsonwebtoken')

const userService = {
  signUp: async (req, res, callback) => {
    try {
      if (!req.body.account || !req.body.name || !req.body.email || !req.body.password || !req.body.checkPassword) {
        return callback({ status: 'error', message: 'input cannot be blank', statusCode: 400 })
      }
      if (req.body.checkPassword !== req.body.password) {
        return callback({ status: 'error', message: 'Password is different', statusCode: 400 })
      }

      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) return callback({ status: 'error', message: 'Email is already exists', statusCode: 400 })

      await User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
      })
      callback({ status: 'success', message: 'User was successfully registered' })
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'Internal Server Error', statusCode: 500 })
    }
  },
  signIn: async (req, res, callback) => {
    try {
      if (!req.body.email || !req.body.password) {
        return callback({ status: 'error', message: "required fields didn't exist", statusCode: 400 })
      }

      const { email, password } = req.body
      const user = await User.findOne({ where: { email: email } })

      if (!user) return callback({ status: 'error', message: "user not found", statusCode: 401 })

      if (user.role !== 'user') return callback({ status: 'error', message: "Authorization denied", statusCode: 401 })

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
          role: user.role,
          account: user.account
        }
      })
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'Internal Server Error', statusCode: 500 })
    }
  },
  getTopUser: async (req, res, callback) => {
    try {
      let users = await User.findAll(
        {
          where: { role: 'user' },
          attributes: {
            include: [
              [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'), 'FollowerCount']
            ]
          },
          order: [
            [sequelize.literal('FollowerCount'), 'DESC']
          ]
        })
      users = users.map(user => ({
        ...user.dataValues,
        isFollowed: req.user.Followings.map(following => following.id).includes(user.id)
      }))
      callback(users)
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'Internal Server Error', statusCode: 500 })
    }
  },
  //Oscar start here
  getUser: async (req, res, callback) => {
    try {
      const user = await User.findOne({
        where: { id: req.params.id, role: "user" },
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Tweet }
        ]
      })
      if (!user) return callback({ status: 'error', message: 'User not found', statusCode: 400 })
      callback(user)
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'Internal Server Error', statusCode: 500 })
    }
  },

  editUser: async (req, res, callback) => {
    try {
      const loginUser = helpers.getUser(req)
      if (loginUser.id != req.params.id) return callback({ status: 'error', message: "Authorization denied", statusCode: 401 })

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
      const loginUser = helpers.getUser(req)
      if (loginUser.id != req.params.id) return callback({ status: 'error', message: "Authorization denied", statusCode: 401 })

      if (!req.body.name) {
        return callback({ status: 'error', message: "Please insert a name for user!", statusCode: 400 })
      }

      let { files } = req
      if (files === undefined) files = []

      if (files.length !== 0) {    //編輯個人資料
        if (files.length === 1) {   //單張圖片判斷圖片種類
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
        } else {    //兩張圖片
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
      } else {    //帳戶設定
        if (req.body.checkPassword !== req.body.password) {
          return callback({ status: 'error', message: 'Password is different', statusCode: 400 })
        }
        const user = await User.findByPk(req.params.id)
        await user.update({
          name: req.body.name ? req.body.name : user.name,
          account: req.body.account ? req.body.account : user.account,
          email: req.body.email ? req.body.email : user.email,
          introduction: req.body.introduction ? req.body.introduction : user.introduction,
          password: req.body.password ? bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null) : user.password
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
          { model: Tweet, include: [{ model: User }, { model: Like }, { model: Reply }] }
        ]
      })
      callback(replies)
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'Internal Server Error', statusCode: 500 })
    }
  },

  //Wei start here
  getUserLikes: async (req, res, callback) => {
    try {
      const likes = await Like.findAll({
        where: { UserId: req.params.id },
        include: [
          { model: Tweet, include: [{ model: User }, { model: Like }, { model: Reply }] }
        ]
      })
      callback(likes)
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'Internal Server Error', statusCode: 500 })
    }
  },
  getFollowings: async (req, res, callback) => {
    try {
      let user = await User.findByPk(req.params.id,
        {
          include: [
            { model: User, as: 'Followings' },
          ],
        })
      user = user.Followings.map(user => ({
        ...user.dataValues,
        followerId: user.Followship.followerId,
        followingId: user.Followship.followingId,
        isFollowed: helpers.getUser(req).Followings.map(following => following.id).includes(user.id)
      }))
      user = user.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      callback(user)
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'Internal Server Error', statusCode: 500 })
    }
  },
  getFollowers: async (req, res, callback) => {
    try {
      let user = await User.findByPk(req.params.id,
        {
          include: [
            { model: User, as: 'Followers' }
          ],
        })
      user = user.Followers.map(user => ({
        ...user.dataValues,
        followerId: user.Followship.followerId,
        followingId: user.Followship.followingId,
        isFollowed: helpers.getUser(req).Followings.map(following => following.id).includes(user.id)
      }))
      user = user.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      callback(user)
    } catch (err) {
      console.log(err)
      callback({ status: 'error', message: 'Internal Server Error', statusCode: 500 })
    }

  }
}

module.exports = userService