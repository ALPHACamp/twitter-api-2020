const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const helpers = require('../_helpers')

router.get('/users', helpers.authenticated, helpers.authenticatedAdmin, adminController.getAllUser)

router.delete('/tweets/:id', helpers.authenticated, helpers.authenticatedAdmin, adminController.deleteTweet)

// router.delete('/:id', helpers.authenticated, helpers.authenticatedAdmin, adminController.deleteFollowing)


module.exports = router