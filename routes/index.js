const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')

const { generalErrorHandler } = require('../middleware/error-handler')

router.put('/api/users/:id', userController.putUser)
router.use('/', (req, res) => res.send('Hello, world!'))

router.use('/', generalErrorHandler)

module.exports = router
