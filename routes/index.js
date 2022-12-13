const express = require('express')
const router = express.Router()
const userController = require('../controllers/user-controller')

const { generalErrorHandler } = require('../middleware/error-handler')

router.post('/users', userController.postUsers)
router.use('/', generalErrorHandler)

module.exports = router