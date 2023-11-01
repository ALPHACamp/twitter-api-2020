const express = require('express')
const router = express.Router()

const { errorHandler } = require('../middleware/error-handler')
const userController = require('../controllers/user-controller')

// user signup and signin
router.post('/api/users/signin', userController.signIn)
router.post('/api/users', userController.signUp)

router.use('/', errorHandler)

module.exports = router
