const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')

router.delete('/:followingId', followshipController.deleteFollow)
router.post('/', followshipController.postFollow)

module.exports = router
