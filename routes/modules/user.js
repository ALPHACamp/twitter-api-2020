const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.get('/:id', userController.getUser)
router.get('/current_user', userController.getCurrentUser)

module.exports = router
