const express = require('express')
const router = express.Router()
const followshipController = require('../controllers/followship-controller')


router.delete('/:id', followshipController.deleteFollowships)
router.post('/', followshipController.postFollowships)

module.exports = router