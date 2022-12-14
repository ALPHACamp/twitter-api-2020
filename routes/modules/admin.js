const express = require('express')
const router = express.Router()

const { generalErrorHandler } = require('../middleware/error-handler')


const adminController = require('../../controllers/admin-controller')

// router.get('/restaurants', adminController.getRestaurants)

router.use('/', generalErrorHandler)

module.exports = router