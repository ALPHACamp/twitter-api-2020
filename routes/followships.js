const express = require('express')
const router = express.Router()

const followshipController = require('../controllers/followshipController')

const { authUserSelf } = require('../middleware/auth')

router.post('/', followshipController.follow)
router.delete('/:followingId', followshipController.unfollow)

module.exports = router
