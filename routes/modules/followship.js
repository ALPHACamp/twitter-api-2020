const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')

router.delete('/:id', followshipController.deleteFollowing)
router.post('/', followshipController.addFollowing)

module.exports = router
