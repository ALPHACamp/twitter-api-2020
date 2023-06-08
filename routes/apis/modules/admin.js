const router = require('express').Router()
const adminController = require('../../../controllers/apis/admin-controller')

// users有關
router.get('/users', adminController.getUsers)

// tweets有關
router.get('/tweets', adminController.getTweets)
router.delete('/tweets/:id', adminController.deleteTweet)

module.exports = router
