const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')

router.delete('/:followingId', userController.removeFollow)

module.exports = router
