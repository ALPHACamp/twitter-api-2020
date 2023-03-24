const express = require('express')
const router = express.Router()

const followshipController = require('../../controllers/followship-controller.js')

router.post('/', followshipController.postFollowship)
router.delete('/:followingId', followshipController.deleteFollowship)
router.get('/', followshipController.getFollowship)

module.exports = router
