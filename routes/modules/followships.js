const express = require('express')
const router = express.Router()

const followshipController = require('../../controllers/followshipController')

router.route('/').post(followshipController.followUser)
router.route('/:followingId').delete(followshipController.unfollowUser)

module.exports = router
