const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const user = require('./modules/user')
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')


router.use('/api/admin', admin)
router.use('/api/users', user)
router.post(
  '/api/signin', 
  passport.authenticate('local', { session: false, failWithError: true }),
  userController.signin
)

router.use('/', generalErrorHandler)


module.exports = router