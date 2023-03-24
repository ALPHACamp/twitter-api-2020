const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')

router.get('/top/:count', followshipController.getMostFollowed)

router.delete('/:followingId', followshipController.removeFollowing)

router.post('/', followshipController.addFollowing)

module.exports = router
