const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')

router.post('/:id', authenticated, followshipController.addFollowing)
router.delete('/:id', authenticated, followshipController.removeFollowing)

module.exports = router