const express = require('express')
const router = express.Router()
const passport = require('../config/passport.js')
const userController = require('../controllers/api/userController.js')
const { registerRules, validResultCheck, loginRules } = require('../middleware/validator')

// wrap passport authenticate method to pass mocha test
function authenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (error, user, info) => {
    if (error) return next(error)
    if (!user) return res.status(401).json({ status: 'error', message: 'UnAuthorized' })
    req.user = user
    return next()
  })(req, res, next)
};

router.post('/users', registerRules(), validResultCheck, userController.signUp)
router.post('/signin', loginRules(), validResultCheck, userController.signIn)
router.get('/users/:id', authenticated, userController.getUser)


module.exports = router