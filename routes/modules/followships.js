const express = require('express')
const router = express.Router()

const followController = require('../../controllers/follow-controller')

router.post('/', followController.addFollowing)
router.delete('/:followingId', followController.removeFollowing)

module.exports = router
