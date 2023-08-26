const express = require('express')
const router = express.Router()

const followeshipController = require('../../controllers/followship-controller')

router.delete('/:followingId', followeshipController.removeFollowing)
router.post('/', followeshipController.addFollowing)

module.exports = router
