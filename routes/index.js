const express = require('express')
const userController = require('../controllers/userController.js')
const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })




module.exports = (app) => {
  // JWT signin & signup
  app.post('/api/users', userController.signUp)
}