const express = require('express')
const router = express.Router()

const followshipController = require('../../controllers/followship-controller')

router.get('/top_users', followshipController.getTopUsers)
router.delete('/:userId', followshipController.deleteFollowship)
router.post('/:userId', followshipController.postFollowship)

module.exports = router
