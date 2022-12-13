const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')

router.get('/top_followers', followshipController.getTopFollowers)
router.delete('/:followingId', followshipController.deleteFollowing)
router.post('/', followshipController.addFollowing)

module.exports = router
