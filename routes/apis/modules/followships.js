const express = require('express')
const router = express.Router()
const followshipController = require('../../../controllers/apis/followship-controller')

router.delete('/:followingId', followshipController.deleteFollowing)
router.post('/', followshipController.addFollowing)

module.exports = router
