const express = require('express')
const router = express.Router()
const followshipController = require('../controllers/followshipController')
const helpers = require('../_helpers')

router.get('/', followshipController.showAllUser)

router.post('/:id', followshipController.addFollowing)

router.delete('/:id', followshipController.deleteFollowing)


module.exports = router