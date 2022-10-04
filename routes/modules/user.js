const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.put('/:id', userController.putUser)

module.exports = router
