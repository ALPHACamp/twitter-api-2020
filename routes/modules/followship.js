const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')

const { authenticated } = require('../../middleware/auth')

router.post('/', authenticated, followshipController.addFollowing)
router.delete('/:followingId', authenticated, followshipController.removeFollowing)

module.exports = router