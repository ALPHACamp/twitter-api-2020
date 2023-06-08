const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')
const userController = require('../controllers/userController')

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.post('/signup', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn) // 告訴passport不用session了 改用token驗證
router.put('/users/:id', authenticated, userController.putUser)
router.get('/users/top',authenticated, userController.getTopUsers)
router.get('/users/:id',authenticated, userController.getUser)
router.delete('/users/:id', authenticated, userController.deleteUser)
router.use('/', apiErrorHandler)
module.exports = router