const express = require('express')
const router = express.Router()
const passport = require('../../../config/passport')
const { authenticated, authenticatedAdmin } = require('../../../middleware/api-auth')
const userController = require('../../../controllers/apis/user-controller')

router.post('/', userController.signUp)
router.get('/:id', authenticated, userController.getUser)

module.exports = router
