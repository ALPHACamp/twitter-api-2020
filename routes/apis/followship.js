const express = require('express')
const router = express.Router()
const { authenticated, authenticatedNotAdmin } = require('../../middleware/auth.js')

const followshipController = require('../../controllers/followshipController.js')

// followship routes
router.use(authenticated, authenticatedNotAdmin) // 下方路由皆須身份驗證

router.post('/', followshipController.addFollowing)
router.delete('/:followingId', followshipController.removeFollowing)

module.exports = router
