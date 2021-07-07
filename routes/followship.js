const express = require('express')
const router = express.Router()
const followshipController = require('../controllers/followshipController')
const helpers = require('../_helpers')

router.post('/:id', helpers.authenticated, helpers.authenticatedUser, followshipController.addFollowing)

router.delete('/:id', helpers.authenticated, helpers.authenticatedUser, followshipController.deleteFollowing)


module.exports = router