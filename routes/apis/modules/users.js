const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/user-controller')

router.get('/1/tweets', userController.getUser)
router.get('/top', userController.getTopUsers)
router.get('/1', userController.getUser)
router.get('/', userController.getUsers)

module.exports = router
