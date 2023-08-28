// following function
const express = require('express')
const router = express.Router()

const followshipController = require('../../controllers/followship-controller')

router.delete('/:id', followshipController.removeFollowing)
router.post('/', followshipController.addFollowing)

module.exports = router