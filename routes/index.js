const express = require('express')
const router = express.Router()

const { errorHandler } = require('../middleware/error-handler')
const userController = require('../controllers/user-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')

router.post('/api/users', userController.signUp)
router.use('/', errorHandler)
module.exports = router
