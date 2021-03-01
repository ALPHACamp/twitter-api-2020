const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/api/adminController')

router.get('/users', adminController.getUsers)
router.delete('/tweets/:id', adminController.removeTweet)

module.exports = router
