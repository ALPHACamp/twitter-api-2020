const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')
const { authenticated } = require('../../middleware/auth')

router.use(authenticated)
router.delete('/:id', followshipController.removeFollowing)
router.post('/', followshipController.addFollowing)
module.exports = router