const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })
const userController = require('../controllers/api/userController')


router.post('/signin', authenticated, userController.getUser)

module.exports = router