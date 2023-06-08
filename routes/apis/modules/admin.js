const express = require('express')
const router = express.Router()
const adminController = require('../../../controllers/admin-controller')

router.get('/users', adminController.getUsers)
router.get('/tweets', adminController.getTweets)
router.delete('/tweet/:id', adminController.deleteTweet)

module.exports = router
