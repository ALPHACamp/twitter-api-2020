const express = require('express')
const router = express.Router()
const passport = require('passport')

const adminController = require('../../../controllers/admin-controller')

router.get('/users', adminController.getUsers)
router.post('/login', passport.authenticate('local', { session: false }), adminController.login)

module.exports = router
