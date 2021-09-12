const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followshipController')
const { authenticated, authenticatedRole } = require('../../middlewares/auth')

router.post('/', followshipController.addFollowing)
router.delete('/:followingId', followshipController.deleteFollowing)

module.exports = router
