const express = require('express')
const router = express.Router()
const followController = require('../../controllers/followController')
const { authenticated, authenticatedUser } = require('../../middleware/auth')

// router.use(authenticated, authenticatedUser)
router.post('/', followController.addFollowing)

module.exports = router
