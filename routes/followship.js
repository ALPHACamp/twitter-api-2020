const express = require('express')
const router = express.Router()
const followshipController = require('../controllers/followshipController')

router.get('/', followshipController.showAllUser)

router.post('/', followshipController.addFollowing)

router.delete('/:id', followshipController.deleteFollowing)


module.exports = router