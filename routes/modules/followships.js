const express = require('express')
const router = express.Router()

const followshipController = require('../../controllers/followship-controller')

router.delete('/:followingId', followshipController.deleteFollowing)
router.get('/', followshipController.getTopUser)
router.post('/', followshipController.addFollowing)

module.exports = router
