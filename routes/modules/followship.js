const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')

// Followship
router.get('/top', followshipController.getTopUsers)
router.delete('/:followingId', followshipController.removeFollowing)
router.post('/', followshipController.addFollowing)

module.exports = router
