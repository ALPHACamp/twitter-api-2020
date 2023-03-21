const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.delete('/tweets/:id', adminController.deleteTweet)

router.get('/tweets', adminController.getTweet)

router.get('/users',)

module.exports = router

