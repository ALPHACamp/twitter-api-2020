const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followshipController')

// Add following
router.post('/', followshipController.addFollowing)

// Delete following
router.delete('/:followingId', followshipController.deleteFollowing)

module.exports = router
