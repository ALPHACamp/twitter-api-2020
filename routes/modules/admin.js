const express = require('express')
const router = express.Router()

const { generalErrorHandler } = require('../../middleware/error-handler')

const adminController = require('../../controllers/admin-controller')

router.delete('/tweets/:id', adminController.deleteTweet)
router.get('/tweets', adminController.getTweets)

router.use('/', generalErrorHandler)

module.exports = router
