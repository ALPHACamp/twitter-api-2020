const express = require('express')
const router = express.Router()

const subscriptionController = require('../../controllers/subscriptionController')

router.post('/users/:id/subscribe', subscriptionController.addSubscription)

module.exports = router
