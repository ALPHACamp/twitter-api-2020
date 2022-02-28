const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
// const users = require('./modules/users')

// router.use('/users', users)
router.post('/users', userController.signUp)

module.exports = router