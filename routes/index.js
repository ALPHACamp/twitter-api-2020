const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')

router.post('/api/users', userController.signUp)

router.get('/', (req, res) => res.send('hello world'))

router.use('/', generalErrorHandler)

module.exports = router
