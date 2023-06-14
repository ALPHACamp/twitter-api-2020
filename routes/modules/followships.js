const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')

router.post('/', followshipController.postFollowship)
router.delete('/:followingId', followshipController.deleteFollowship)

module.exports = router
