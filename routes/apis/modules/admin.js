const express = require('express')
const router = express.Router()

const adminController = require('../../../controllers/admin-controller')

router.get('/tweets', adminController.getTweet)

// 管理者登入
// router.post('/signin', userController.signIn)

module.exports = router

