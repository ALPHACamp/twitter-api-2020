const passport = require('passport')
const router = require('express').Router()

const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')
const adminController = require('../../controllers/admin-controller')
const userController = require('../../controllers/user-controller')
const followships = require('./followship.js')

const tweets = require('./tweet')
const users = require('./user')
const admin = require('./admin')

router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})

router.post('/users', userController.signUp)
router.post('/admin/login', passport.authenticate('local', { session: false, failureMessage: true, failWithError: true }), adminController.signIn, adminController.signInFail)
router.post('/users/login', passport.authenticate('local', { session: false, failureMessage: true, failWithError: true }), userController.signIn, userController.signInFail)

router.use(authenticated)
router.use('/admin', authenticatedAdmin, admin)
router.use('/users', users)
router.use('/tweets', tweets)
router.use('/followships', followships)

router.use('/', apiErrorHandler)
module.exports = router
