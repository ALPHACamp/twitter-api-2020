const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')

const admin = require('./modules/admin')

const adminController = require('../../controllers/admin-controllers')
const userController = require('../../controllers/user-controllers')

const { authenticated, authenticatedAdmin, authenticatedNoAdmin } = require('../../middleware/api-auth')

router.post('/users/signin',passport.authenticate('local', { session: false }), adminController.login)
router.post('/admin/login',passport.authenticate('local', { session: false }), adminController.login)

router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id', authenticated, userController.getUser)

router.post('/users', userController.signUp)

router.use('/admin', authenticated, authenticatedAdmin, admin)

module.exports = router
