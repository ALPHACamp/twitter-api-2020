const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followshipController')

const { authenticated, checkRole } = require('../../middlewares/auth')

router.post('/', followshipController.addFollowing)

module.exports = router
