const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth')
const followshipController = require('../../controllers/followshipController')

router.post('/', authenticated, followshipController.followUser)
router.delete('/:followingId', authenticated, followshipController.unfollowUser)

module.exports = router
