const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/adminController')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')

router.use(authenticated, authenticatedAdmin)

router.get('/users', adminController.getUsers)
router.delete('/tweets/:id', adminController.deleteTweet)

module.exports = router
