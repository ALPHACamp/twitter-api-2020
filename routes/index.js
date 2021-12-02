const express = require('express')
const userController = require('../controllers/userController.js')
const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false }) //登入token驗證
const helpers = require('../_helpers')

//驗前台是user身分
const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req).role === 'admin') {
    return res
      .status(401)
      .json({ status: 'error', message: 'permission denied' })
  }
  return next()
}

// use helpers.getUser(req) to replace req.user
//驗後台身分
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req).role === 'user') {
    return res
      .status(401)
      .json({ status: 'error', message: 'permission denied' })
  }
  return next()
}

module.exports = (app) => {
  // JWT signin & signup
  app.post('/api/signin', userController.signIn)

  app.get(
    '/api/users/:id',
    authenticated,
    authenticatedUser,
    userController.getUser
  )
}
