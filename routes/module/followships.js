const express = require('express')
const router = express.Router()

const followController = require('../../controllers/follow-controller')

router.post('/', followController.addFollow)

module.exports = router
