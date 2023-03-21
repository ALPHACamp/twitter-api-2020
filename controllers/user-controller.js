const jwt = require('jsonwebtoken')
const { User } = require('../models')
const bcrypt = require('bcryptjs')
const passport = require('../config/passport')

const userController = {
  login: (req, res, next) => {
    passport.authenticate('local', { session: false, failWithError: true }, (err, user, info) => {
      // err: null & user: false => 400
      if (!err && !user) {
        const error = new Error('輸入資料不可為空值!')
        error.status = 400
        return next(error)
      }

      if (err || !user) {
        if (err.status === 401) {
          return next(err)
        }
      }
      if (user.role !== 'user') {
        const error = new Error('驗證失敗!')
        error.status = 401
        return next(error)
      }
      try {
        const userData = user.toJSON()
        delete userData.password
        const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
        res.json({
          token,
          user: { id: userData.id }
        })
      } catch (err) {
        return next(err)
      }
    })(req, res, next)
  },
  signUp: (req, res, next) => {
    if (!req.body.email.trim() || !req.body.account.trim() || !req.body.name.trim() || !req.body.password.trim() || !req.body.checkPassword.trim()) {
      const error = new Error('輸入資料不可為空值!')
      error.status = 400
      throw error
    }

    if (req.body.password !== req.body.checkPassword) {
      const error = new Error('密碼輸入不相符！')
      error.status = 403
      throw error
    }

    User.findOne({ where: { account: req.body.account } })
      .then(user => {
        if (user) {
          const error = new Error('account 已重複註冊！')
          error.status = 403
          throw error
        }

        return bcrypt.hash(req.body.password, 10)
      })
      .catch(err => next(err))

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) {
          const error = new Error('email 已重複註冊！')
          error.status = 403
          throw error
        }

        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash => User.create({
        account: req.body.account,
        name: req.body.name,
        email: req.body.email,
        password: hash
      }))
      .then(user => {
        res.json({
          status: 'success'
        })
      })
      .catch(err => next(err))
  },
  getUser: (req, res, next) => {
    User.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(user => {
        if (!user) {
          const error = new Error('此使用者不存在!')
          error.status = 404
          throw error
        }
        return user
      })
      .then(user => {
        const userData = user.toJSON()
        // count followers and following
        userData.followerCounts = userData.Followers.length
        userData.followingCounts = userData.Followings.length
        userData.isFollowed = userData.Followers?.some(follower => follower.id === req.user.id)
        userData.isCurrentUser = req.user.id === user.id
        // delete unused properties
        delete userData.password
        delete userData.Followers
        delete userData.Followings

        res.json(userData)
      })
      .catch(err => next(err))
  }
}

module.exports = userController
