const express = require('express')
const router = express.Router()
// const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const { errorHandler } = require('../middleware/error-handler')

router.post('/users/login', userController.login)

router.post('/users', userController.signUp)

router.use('/', errorHandler)

module.exports = router
