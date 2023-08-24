const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')

router.post('/', followshipController.followUser)

module.exports = router
