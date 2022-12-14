const express = require('express')
const router = express.Router()
<<<<<<< HEAD
const userController = require('../controllers/user-controller')
const { apiErrorHandler } = require('../middleware/error-handler')

router.post('/api/users', userController.signUp)
router.use('/', apiErrorHandler)
=======
const passport = require('../config/passport')
const userController = require('../controllers/user-controller')

router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
>>>>>>> 36f7ae15f623236c04eedbf7e1d48d0d35256d54

module.exports = router
