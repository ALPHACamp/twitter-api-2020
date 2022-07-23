const express = require('express')
const router = express.Router()

const userController = require('../../controllers/apis/user-controller')

const { apiErrorHandler } = require('../../middleware/error-handler')

router.post('/users', userController.signUp)
router.use('/', apiErrorHandler)

module.exports = router
