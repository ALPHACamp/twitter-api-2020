const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')

const { userAuthenticated } = require('../../middleware/auth')

router.post('/', userAuthenticated, followshipController.addFollowing)
router.delete('/:followingId', userAuthenticated, followshipController.removeFollowing)

module.exports = router