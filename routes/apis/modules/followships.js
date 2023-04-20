const express = require('express')
const router = express.Router()

const followshipController = require('../../../controllers/followship-controller')

router.delete('/:followingId', followshipController.deleteFollowship)
router.post('/', followshipController.postFollowship)
router.get('/top', followshipController.getTop)

module.exports = router
