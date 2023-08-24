const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')

router.post('/', followshipController.followUser)
router.delete('/:followingId', followshipController.unfollowUser)

module.exports = router
