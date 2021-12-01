const express = require('express')
const userController = require('../controllers/userController.js')
const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) {
      return next()
    }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

module.exports = (app) => {
  // JWT signin & signup
  app.post('/api/signin', userController.signIn)
}
