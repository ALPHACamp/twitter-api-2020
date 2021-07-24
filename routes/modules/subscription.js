const express = require('express')
const router = express.Router()

const subscriptionController = require('../../controllers/subscriptionController')

router.post('/users/:id/subscribe', subscriptionController.addSubscription)
router.delete('/users/:id/subscribe', subscriptionController.removeSubscription)

module.exports = router
