// express
const express = require('express')
const router = express.Router()

// call controller
const testController = require('../controllers/testController.js')
const userController = require('../controllers/userController.js')

router.get('/test', testController.getTestData)
router.post('/users', userController.signUp)
router.post('/login', userController.signIn)

module.exports = router
