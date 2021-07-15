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
  getUser: (req, res) => {
    const UserId = req.params.id
    userService.getUser(req, res, 'user', UserId)
      .then(data => { return data })
  },
  getUserTweets: (req, res) => {
    const UserId = req.params.id
    const viewerId = req.user.id
    userService.getUserTweets(req, res, 'user', UserId, viewerId)
      .then(data => { return data })
  },
  getUserLikes: (req, res) => {
    const UserId = req.params.id
    const viewerId = req.user.id
    userService.getUserLikes(req, res, 'user', UserId, viewerId)
      .then(data => { return data })
  },
  getUserFollowings: (req, res) => {
    const UserId = req.params.id
    const viewerId = req.user.id
    userService.getUserFollowings(req, res, 'user', UserId, viewerId)
      .then(data => { return data })
  },
  getUserFollowers: (req, res) => {
    const UserId = req.params.id
    const viewerId = req.user.id
    userService.getUserFollowers(req, res, 'user', UserId, viewerId)
      .then(data => { return data })
  },
  getTopUsers: (req, res) => {
    const viewerId = req.user.id

    return User.findAll({
      include: {
        model: User,
        as: 'Followers',
        where: { id: viewerId },
        attributes: ['id'],
        required: false,
        nest: true
      },
      where: { role: { [Op.ne]: 'admin' } },
      attributes: ['id', 'name', 'account', 'avatar', 'introduction', 'followerCount'],
      order: [['followerCount', 'DESC']],
      limit: 10,
      nest: true,
      raw: true
    }).then(users => {
      users = users.map((item, i) => {
        const mapItem = {
          ...item,
          isFollowing: Boolean(item.Followers.id)
        }
        delete mapItem.Followers
        delete mapItem.followerCount
        return mapItem
      })
      return res.status(200).json(users)
    })
  },

  putUser: (req, res) => {
    const UserId = req.params.id
    const viewerId = req.user.id

    if (Number(UserId) !== viewerId) {
      return res.status(400).json({
        status: 'error',
        message: 'This is not this user\'s account.'
      })
    }

    if (!req.body.name) {
      return res.status(400).json({
        status: 'error',
        message: 'User name required.'
      })
    }

    const { files } = req

    // TODO：改善重複上傳的問題
    if (files) {
      imgur.setClientId(IMGUR_CLIENT_ID)
      const avatar = files.avatar ? imgur.uploadFile((files.avatar[0].path)) : null
      const cover = files.cover ? imgur.uploadFile((files.cover[0].path)) : null

      Promise.all([avatar, cover])
        .then(images => {
          return User.findByPk(UserId)
            .then(user => {
              user.update({
                name: req.body.name,
                introduction: req.body.introduction,
                avatar: files.avatar ? images[0].link : user.avatar,
                cover: files.cover ? images[1].link : user.cover
              })
              return res.status(200).json({
                status: 'success',
                message: 'User successfully updated.'
              })
            })
        })
    } else {
      return User.findByPk(UserId)
        .then((user) => {
          user.update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: user.avatar,
            cover: user.cover
          }).then(() => {
            return res.status(200).json({
              status: 'success',
              message: 'User successfully updated.'
            })
          })
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
