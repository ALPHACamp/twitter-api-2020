const express = require('express')
const router = express.Router()
const followController = require('../../controllers/follow-controller')
const { authenticated, authenticatedUser } = require('../../middleware/auth')

router.post('/', authenticated, authenticatedUser, followController.postFollow)

module.exports = router
