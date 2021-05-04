const express = require('express')
const router = express.Router()

const subscriptionController = require('../../controllers/subscriptionController')

router.route('/').post(subscriptionController.subscribeUser)
router.route('/:authorId').delete(subscriptionController.unsubscribeUser)

module.exports = router
