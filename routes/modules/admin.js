const router = require('express').Router()
const adminController = require('../../controllers/admin-controller')

router.get('/users', adminController.getUsers)

module.exports = router
