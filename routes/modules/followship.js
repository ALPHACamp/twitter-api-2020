const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')
const { authenticated } = require('../../middleware/auth')

router.use(authenticated)
router.post('/:id', followshipController.addFollowing)
router.delete('/:id', followshipController.removeFollowing)

module.exports = router