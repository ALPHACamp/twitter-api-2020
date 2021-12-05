// 載入所需套件
const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/adminController')
const { authenticated, checkNotUser } = require('../../middlewares/auth')

router.post('/signin', adminController.adminLogin)
router.get('/tweets', authenticated, checkNotUser, adminController.getAllTweets)
router.delete('/tweets/:tweet_id', authenticated, checkNotUser, adminController.deleteTweet)
router.get('/users', authenticated, checkNotUser, adminController.getAllUsers)

// router exports
module.exports = router