const bcrypt = require('bcryptjs')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const db = require('../../models')
const User = db.User
const Followship = db.Followship

const helpers = require('../../_helpers')

const userController = {
  signUp: (req, res, callback) => {
    if (req.body.passwordCheck !== req.body.password) {
      return callback({ status: 'error', message: '兩次密碼輸入不同！' })
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          return callback({ status: 'error', message: '信箱重複！' })
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            return callback({ status: 'success', message: '成功註冊帳號！' })
          })
        }
      })
    }
  },

  signIn: (req, res, callback) => {
    // 檢查必要資料
    if (!req.body.email || !req.body.password) {
      return callback({ status: 'error', message: "required fields didn't exist" })
    }
    // 檢查 user 是否存在與密碼是否正確
    const username = req.body.email
    const password = req.body.password

    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return callback({ status: 'error', message: 'no such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return callback({ status: 'error', message: 'passwords did not match' })
      }
      // 簽發 token
      const payload = { id: user.id }
      const token = jwt.sign(payload, process.env.JWT_SECRET)
      return callback({
        status: 'success',
        message: '登入成功',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      })
    })
  },

  getUsers: (req, res, callback) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }, { model: User, as: 'Followings' }]
    }).then(users => {
      users = users.map(user => ({
        ...user.toJSON(),
        followerCount: user.Followers.length
      }))
      return res.json(users)
    })
  }
}

module.exports = userController
