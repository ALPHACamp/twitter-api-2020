const express = require('express')
const router = express.Router()

const followshipController = require('../../controllers/followshipController')

router.post('/', followshipController.addFollowing)
router.delete('/:following_id', followshipController.removeFollowing)

module.exports = router
