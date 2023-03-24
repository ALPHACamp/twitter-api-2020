const router = require('express').Router()
const followshipController = require('../../controllers/followship-controller.js')

router.delete('/:followingId', followshipController.deleteFollowships)
router.post('/', followshipController.postFollowships)

module.exports = router
