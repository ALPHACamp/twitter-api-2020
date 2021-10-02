const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/adminController.js')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')

router.post('/login', adminController.adminLogin)
router.use(authenticated, authenticatedAdmin)
router.get('/tweets', adminController.getAdminTweets)
router.delete('/tweets/:id', adminController.deleteAdminTweets)
router.get('/users', adminController.getAdminUsers)


module.exports = router