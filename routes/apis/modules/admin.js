const express = require('express')
const router = express.Router()
// const passport = require('passport')

const { authenticated, authenticatedAdmin } = require('../../../middleware/api-auth')
const adminController = require('../../../controllers/admin-controller')

router.get('/users', authenticated, authenticatedAdmin, adminController.getUsers)

router.post('/login', passport.authenticate('local', { session: false }), adminController.login)
// router.get('/user', authenticated, authenticatedAdmin, adminController.getUser)

module.exports = router
