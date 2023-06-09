const express = require('express')
const router = express.Router()

const followshipController = require('../../controllers/followship-controller')

router.get('/', followshipController.getFollowship)


module.exports = router

