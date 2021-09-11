const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followshipController')
const { authenticated, authenticatedRole } = require('../../middlewares/auth')

router.post('/', followshipController.addFollowing)

module.exports = router
