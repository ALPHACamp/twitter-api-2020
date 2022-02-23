const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const user = require('./modules/user')
const tweet = require('./modules/tweet')
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')


router.use('/api/admin', admin)
router.use('/api/users', user)
router.use('/api/tweets', tweet)
router.post(
  '/api/signin', 
  passport.authenticate('local', { session: false }),
  userController.signin
)

router.use('/', generalErrorHandler)


module.exports = router