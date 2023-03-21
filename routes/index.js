const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const passport = require('../config/passport')
const admin = require('./modules/admin')
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')
const { apiErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)
// router.get('/api/admin/restaurants', authenticated, apiErrorHandler)

router.post('/signup', userController.signUp)
// (下1) session: false 的功能，把 cookie/session 功能關掉，不管理它
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn) // 注意是 post

router.get('/', (req, res, next) => res.send('twitter api'))

router.use('/', apiErrorHandler)

module.exports = router
