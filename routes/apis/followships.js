const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followshipController')
const { authenticated } = require('../../middleware/auth')

router.post('/:userId', authenticated, followshipController.addFollowing)
router.delete('/:userId', authenticated, followshipController.removeFollowing)

module.exports = router