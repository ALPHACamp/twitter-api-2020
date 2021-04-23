const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth')
const subscriptionController = require('../../controllers/subscriptionController')

router.route('/').post(authenticated, subscriptionController.subscribeUser)

router
  .route('/:authorId')
  .delete(authenticated, subscriptionController.unsubscribeUser)

module.exports = router
