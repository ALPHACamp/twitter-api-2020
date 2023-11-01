const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
router.use('/admin', admin)
//const restController = require('../../controllers/apis/restaurant-controller')
//router.get('/restaurants', restController.getRestaurants)


module.exports = router