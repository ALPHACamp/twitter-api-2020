const express = require('express')
const router = express.Router()

const followshipController = require('../controllers/followshipController')

const { authUserSelf } = require('../middleware/auth')

router.post('/', authUserSelf, followshipController.follow)
router.delete('/:followingId', authUserSelf, followshipController.unfollow)

module.exports = router
