// user routes
const express = require('express')
const router = express.Router()
// import controller
const followshipController = require('../../controllers/followship-controller')
// import auth
const {
  authenticated,
  authenticatedUser
} = require('../../middleware/api-auth')

// followships
router.delete('/:followingId', authenticated, authenticatedUser, followshipController.removeFollowship)
router.post('/', authenticated, authenticatedUser, followshipController.addFollowship)
router.get('/', authenticated, authenticatedUser, followshipController.getTop10Followers)

module.exports = router
