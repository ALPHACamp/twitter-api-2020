const express = require('express')
const router = express.Router()
const followController = require('../../controllers/followship-controller')

router.post('/', followController.postFollow)
router.delete('/:followingId', followController.deleteFollow)

module.exports = router
