const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')

const { generalErrorHandler } = require('../middleware/error-handler')

router.put('/api/users/:id', userController.putUser)
router.post('/api/users/signUp', userController.signUp)

router.use('/', generalErrorHandler)

module.exports = router
