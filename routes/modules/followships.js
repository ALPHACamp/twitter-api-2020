const express = require('express')
const router = express.Router()
const followController = require('../../controllers/followController')
const { authenticatedUser } = require('../../middleware/auth')

router.use(authenticatedUser)
router.post('/', followController.addFollowing)
router.delete('/:followingId', followController.removeFollowing)

module.exports = router
