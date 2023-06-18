const express = require('express')
const router = express.Router()
const { authenticated, authenticatedUser, validateUser } = require('../../middleware/auth')
const followshipController = require('../../controllers/followshipController')

router.post('/', authenticated, authenticatedUser, validateUser, followshipController.addFollowing)
router.get('/top', authenticated, authenticatedUser, validateUser, followshipController.getTopFollowing)
router.delete('/:followingId', authenticated, authenticatedUser, validateUser, followshipController.removeFollowing)

module.exports = router
