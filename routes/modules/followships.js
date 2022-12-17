const express = require('express')
const router = express.Router()

const followshipController = require('../../controllers/followshipController')

router.post('/followships', followshipController.addFollowing)
router.delete('/followships/:following_id', followshipController.removeFollowing)

module.exports = router
