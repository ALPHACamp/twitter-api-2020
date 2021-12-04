const express = require('express')
const userController = require('../controllers/userController.js')
const passport = require('../config/passport')
const helpers = require('../_helpers')

//驗前台是user身分
const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req).role === 'admin') {
    return res.status(401).json({ status: 'error', message: '帳號不存在！' })
  }
  return next()
}

// use helpers.getUser(req) to replace req.user
//驗後台身分
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req).role === 'user') {
    return res.status(401).json({ status: 'error', message: '帳號不存在！' })
  }
  return next()
}

//登入token驗證
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) {
      return next(error)
    }
    if (!user) {
      return res.status(401).json({ status: 'error', message: '帳號不存在！' })
    }
    req.user = user
    return next()
  })(req, res, next)
}

module.exports = (app) => {
  // JWT signin & signup
  app.post('/api/users', userController.signUp)
  app.post('/api/users/signin', userController.signIn)

  //users routes
  app.get(
    '/api/users/:id',
    authenticated,
    authenticatedUser,
    userController.getUser
  )
}
