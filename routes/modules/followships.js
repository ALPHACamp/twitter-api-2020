const express = require('express')
const followController = require('../../controllers/follower-controller')
const router = express.Router()

router.delete('/:followingId', followController.removeFollowships)
router.post('/', followController.addFollowships)

module.exports = router
