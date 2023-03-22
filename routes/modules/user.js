const express = require('express')
const router = express.Router()
const userController = require('../../controllers/admin-controller')
// const upload = require('../../../middleware/multer')

router.get('/users/top', userController.getTopUsers)

module.exports = router
