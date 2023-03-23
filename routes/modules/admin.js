const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
// const upload = require('../../../middleware/multer')

router.get('/users', adminController.getUsers)
module.exports = router
