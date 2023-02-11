const router = require('express').Router()
const adminController = require('../../controllers/admin/adminController')

router.get('/users', adminController.getAllUsers)
router.delete('/tweets/:id', adminController.deleteTweet)
router.get('/tweets', adminController.getAllTweets)

module.exports = router
