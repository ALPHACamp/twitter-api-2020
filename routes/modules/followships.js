const express = require('express')
const router = express.Router()

const followshipController = require('../../controllers/followshipController')

router.post('/', followshipController.addFollowing)

module.exports = router
