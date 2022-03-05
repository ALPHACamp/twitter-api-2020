const express = require('express')
const router = express.Router()
const { authenticated, authenticatedAdmin } = require('../../middleware/auth.js')

const adminController = require('../../controllers/adminController.js')

// admin routes
router.post('/signin', adminController.signIn)

router.use(authenticated, authenticatedAdmin) // 下方路由皆須身份驗證

router.get('/users', adminController.getUsers)
router.get('/tweets', adminController.getTweets)
router.delete('/tweets/:id', adminController.deleteTweet)

module.exports = router
