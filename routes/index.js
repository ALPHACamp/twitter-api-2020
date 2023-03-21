const express = require('express')
const router = express.Router()
// const admin = require('./modules/admin')
const users = require('./modules/users')
const userController = require('../controllers/user-controller')
const { errorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

router.post('/users/login', userController.login)
router.use('/users', authenticated, users)
router.post('/users', userController.signUp)

router.use('/', errorHandler)

module.exports = router
