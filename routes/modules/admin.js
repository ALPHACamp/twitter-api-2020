const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.delete('/tweets/:id', adminController.deleteTweet)
router.get('/users', adminController.getUsers)

module.exports = router
