const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { errorHandler } = require('../middleware/error-handler')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')

router.post('/admin/signin', adminController.signin)
router.post('/signin', userController.signin)

router.use('/admin', authenticated, authenticatedAdmin, admin)

router.get('/', (req, res) => {
  res.json({ data: 'hello' })
})

router.use('/', errorHandler)

module.exports = router
