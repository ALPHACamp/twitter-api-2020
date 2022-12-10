const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')

router.post('/api/signin', passport.authenticate('local', { session: false }), userController.signIn)

// not found router
router.use('/', (_, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Page not found'
  })
  next()
})

// error handler
router.use('/', generalErrorHandler)

module.exports = router
