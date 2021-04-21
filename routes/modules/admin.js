const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/adminController')

router.route('/users').get(adminController.getUsers)
router.route('/tweets/:id').delete(adminController.deleteTweet)

module.exports = router
