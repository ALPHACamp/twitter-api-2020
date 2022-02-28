const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const {
  apiErrorHandler
} = require('../../middleware/error-handler')
// const users = require('./modules/users')

// router.use('/users', users)
router.post('/users', userController.signUp)

router.use('/', apiErrorHandler)

module.exports = router