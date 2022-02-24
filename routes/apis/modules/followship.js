const express = require('express')
const router = express.Router()
const followshipController = require('../../../controllers/followship-controller')

router.post('/', followshipController.postFollowships)
router.delete('/:id', followshipController.deleteFollowships)

module.exports = router