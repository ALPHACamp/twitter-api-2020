const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')

router.post('/', followshipController.followSomeone)
router.delete('/:followingId', followshipController.unfollowSomeone)
module.exports = router
