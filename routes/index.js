const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const userController = require('../controllers/user-controller')

router.post('/api/login', passport.authenticate('local', { session: false }), userController.login)
router.post('/api/users', userController.signUp)
// router.get('/api/user/:id/tweets')
// router.get('/api/user/:id/replied_tweets')
// router.get('/api/user/:id/followings')
// router.get('/api/user/:id/followers')
// router.get('/api/users/:id', userController.getUser)
// router.put('/api/users/:id', userController.putUser)

module.exports = router
