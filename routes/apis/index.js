const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const userController = require('../../controllers/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.use('/admin', admin)
router.post('/users/signin', userController.signin)
router.get('/', (req, res) => res.send('Hello World!'))

router.use('/', apiErrorHandler)
module.exports = router
