const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controlle')

router.post('/', followshipController.postFollow)

module.exports = router
