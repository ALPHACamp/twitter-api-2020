const express = require('express')
const router = express.Router()
const passport = require('../config/passport.js')
const userController = require('../controllers/api/userController.js')
// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) return next(error)
    if (!user) return res.json({ status: 'error', message: 'UnAuthorized' })
    req.user = user
    return next()
  })(req, res, next)
};
router.post('/users', userController.signUp)
router.use('/', (error, req, res, next) => {
  console.log(error)
  return res.json({
    status: 'error',
    message: 'Error occurred. Please check your input or try again later.'
  })
})

module.exports = router