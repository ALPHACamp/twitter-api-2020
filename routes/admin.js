const express = require('express')
const router = express.Router()

const adminController = require('../controllers/adminController')

router.get('/users', adminController.readUsers)
router.delete('/tweets/:id', adminController.deleteTweet)

module.exports = router
