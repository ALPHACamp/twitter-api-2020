const express = require('express')
const router = express.Router()
const followshipController = require('../../controllers/followship-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated } = require('../../middleware/auth')


router.post('/', authenticated,followshipController.postFollow)
router.delete('/:followingId', authenticated, followshipController.deleteFollow)
router.use('/', apiErrorHandler)


module.exports = router