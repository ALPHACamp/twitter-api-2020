const express = require('express')
const route = express.Router()
const userController = require('../../controllers/user-controller')

route.post('/', userController.addFollow)
route.delete('/:followingId', userController.removeFollow)

module.exports = route
