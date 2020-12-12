const express = require('express')
const router = express.Router()
const passport = require('../config/passport.js')
// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) return next(error)
    if (!user) return res.json({ status: 'error', message: 'UnAuthorized' })
    req.user = user
    return next()
  })(req, res, next)
};
