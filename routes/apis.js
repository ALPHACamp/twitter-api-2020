const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

// routes: login & register
router.post('/login', userController.login)
router.post('/users', userController.register)

// authenticated
const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })

// routes after login
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/tweets', authenticated, userController.getTweetsOfUser)

module.exports = router
