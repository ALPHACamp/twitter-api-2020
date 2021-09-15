const express = require('express')
const router = express.Router()
const adminController = require('../controllers/api/adminController')
const { authenticated } = require('../middlewares/auth')

router.get('/admin/tweets', adminController.getTweets)
router.delete('/admin/tweets/:id', adminController.removeTweet)
router.get('/admin/users', adminController.getUsers)

module.exports = router
