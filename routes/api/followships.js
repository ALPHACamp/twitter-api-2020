const express = require('express')
const router = express.Router()

const followshipController = require('../../controllers/api/followshipController')

router.post('/', followshipController.follow)
router.delete('/:followingId', followshipController.unfollow)

module.exports = router
