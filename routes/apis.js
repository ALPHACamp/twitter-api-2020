const express = require('express')
const router = express.Router()
const flash = require('connect-flash')

const userController = require('../controllers/api/userController.js')

router.post('/users', userController.signUp)
router.get('/logout', userController.logout)

module.exports = router