// modules and files
const express = require('express')
const router = express.Router()
const passport = require('../config/passport.js')
const helpers = require('../_helpers.js')

// passport authentication
const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).isAdmin) { return next() }
    return res.json({ status: 'error', message: '沒有權限' })
  } else {
    return res.json({ status: 'error', message: '沒有權限' })
  }
}

// call controller
const testController = require('../controllers/testController.js')
const userController = require('../controllers/userController.js')

router.get('/test', authenticated, authenticatedAdmin, testController.getTestData)
router.post('/users', userController.signUp)
router.post('/login', userController.signIn)

module.exports = router
