const express = require('express')
const router = express.Router()

// const passport = require('../../config/passport')
// const admin = require('./modules/admin')

// const userController = require('../../controllers/apis/user-controller')
// const { authenticate } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/api-error-handler')

const userController = require('../../controllers/user-controller')


// router.use('/admin', admin)

router.post('/login', userController.login)
// router.use('/')


router.use(apiErrorHandler)
module.exports = router