const express = require('express')
const router = express.Router()

const followshipController = require('../../controllers/followship-controller')

router.get('/top_users', followshipController.getTopUsers)
router.delete('/:followingId', followshipController.deleteFollowship)
router.post('/', followshipController.postFollowship)

module.exports = router
