const express = require('express')
const router = express.Router()

const { authenticated, authAdmin } = require('../../middleware/auth')
const adminController = require('../../controllers/admin-controller')

router.post('/signin', adminController.signin)
router.delete('/tweets/:id', authenticated, adminController.deleteTweet)

module.exports = router
