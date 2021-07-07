const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const helpers = require('../_helpers')

router.get('/users', adminController.getAllUser)

router.delete('/tweets/:id', adminController.deleteTweet)


module.exports = router