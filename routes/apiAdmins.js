const express = require('express')
const router = express.Router()

// 載入 controller
const adminController = require('../controllers/adminController')

// 載入 authenticated & authenticatedAdmin
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

// route : login
router.post('/login', adminController.login)

// routes : after login
router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.delete('/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)

module.exports = router
