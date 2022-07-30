const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')


router.get('/:id', userController.getUser)

module.exports = router