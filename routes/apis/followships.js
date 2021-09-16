const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followshipController')
const { authenticated, checkRoleIsUser } = require('../../middleware/auth')

router.post('/', authenticated, checkRoleIsUser, followshipController.addFollowing)
router.delete('/:userId', authenticated, checkRoleIsUser, followshipController.removeFollowing)

module.exports = router