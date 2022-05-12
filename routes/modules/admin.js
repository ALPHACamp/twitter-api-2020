const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.delete('/tweets/:id', adminController.deleteTweets)
router.get('/users', adminController.getAllUsers)

module.exports = router
