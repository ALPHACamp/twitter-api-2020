const express = require('express')
const userController = require('../controllers/userController.js')
const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })//登入token驗證
const helpers = require('../_helpers')

//驗前台是user身分
const authenticatedIsNotAdmin = (req, res, next) => {
  if (authenticated) {
    if (helpers.getUser(req).role !== 'admin') {
      return next()
    }
    return res
      .status(401)
      .json({ status: 'error', message: 'permission denied' })
  } else {
    return res
      .status(401)
      .json({ status: 'error', message: 'permission denied' })
  }
}

// use helpers.getUser(req) to replace req.user
//驗後台身分
const authenticatedIsNotUser = (req, res, next) => {
  if (authenticated) {
    if (helpers.getUser(req).role !== 'user') {
      return next()
    }
    return res
      .status(401)
      .json({ status: 'error', message: 'permission denied' })
  } else {
    return res
      .status(401)
      .json({ status: 'error', message: 'permission denied' })
  }
}

module.exports = (app) => {
  // JWT signin & signup
  app.post('/api/signin', userController.signIn)
}
