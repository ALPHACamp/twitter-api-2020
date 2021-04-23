const express = require('express')
const followController = require('../../controllers/followController')
const router = express.Router()

router.post('/', followController.follow)

module.exports = router
