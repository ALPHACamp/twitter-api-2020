const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')

router.post('/', followshipController.addFollowing)
router.delete('/:followingId', followshipController.removeFollowing)

module.exports = router
