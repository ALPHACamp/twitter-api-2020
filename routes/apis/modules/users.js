const express = require('express')
const router = express.Router()

const { authenticated } = require('../../../middleware/api-auth')
const userController = require('../../../controllers/user-controller')

router.post('/login', userController.login)
router.post('/users', userController.postUsers)
router.get('/top', authenticated, userController.getTopUsers)

exports = module.exports = router