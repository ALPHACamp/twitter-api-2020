const express = require('express')
const adminController = require('../../controllers/admin-controller')
const router = express.Router()

router.delete('/tweets/:id', adminController.deleteTweet)
router.get('/tweets', adminController.tweets)
router.get('/users', adminController.users)

module.exports = router
