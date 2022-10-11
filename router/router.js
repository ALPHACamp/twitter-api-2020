const router = require('express').Router()
const passport = require('../config/passport')
const userRoute = require('./user')
const adminRoute = require('./admin')
const tweetsRoute = require('./user/tweets')
const followshipsRoute = require('./user/followships')
const testRoute = require('./test')
const userController = require('../controllers/user/userController')
const adminController = require('../controllers/admin/adminController')
const {
  apiErrorHandler,
  contentTypeHandlerJson,
  contentTypeHandlerFromData
} = require('../middleware/error-handler')
const {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
} = require('../middleware/auth')

// user login
router.post(
  '/login',
  contentTypeHandlerJson,
  passport.authenticate('local', { session: false }),
  userController.signIn
)
// admin login
router.post(
  '/admin/login',
  contentTypeHandlerJson,
  passport.authenticate('local', { session: false }),
  adminController.adminSignIn
)
// user register
router.post('/users', contentTypeHandlerFromData, userController.signUp)

router.use(
  '/admin',
  contentTypeHandlerJson,
  authenticated,
  authenticatedAdmin,
  adminRoute
)
router.use(
  '/users',
  contentTypeHandlerJson,
  authenticated,
  authenticatedUser,
  userRoute
)
router.use(
  '/tweets',
  contentTypeHandlerJson,
  authenticated,
  authenticatedUser,
  tweetsRoute
)
router.use(
  '/followships',
  contentTypeHandlerJson,
  authenticated,
  authenticatedUser,
  followshipsRoute
)

router.use('/test', testRoute)
router.use('/', apiErrorHandler)

module.exports = router
