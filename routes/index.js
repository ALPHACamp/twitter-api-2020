const express = require('express')
const router = express.Router()

const APItestController = require('../controllers/APItest-controller')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')

const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const followships = require('./modules/followships')
const passport = require('../config/passport')

const { authenticated, signinRoleUser, signinRoleAdmin, authenticateUser, authenticateAdmin } = require('../middlewares/api-auth')
const { apiErrorHandler } = require('../middlewares/error-handler')

router.get('/get_current_user', authenticated, userController.getCurrentUser)
router.get('/test', APItestController.getTestJSON)
router.post(
  '/admin/signin',
  passport.authenticate('local', { session: false }),
  signinRoleAdmin,
  adminController.signIn
)
router.post(
  '/users/signin',
  passport.authenticate('local', { session: false }),
  signinRoleUser,
  userController.signIn
)
router.post('/users', userController.signUp)

router.use('/admin', authenticated, authenticateAdmin, admin)
router.use('/users', authenticated, authenticateUser, users)
router.use('/tweets', authenticated, authenticateUser, tweets)
router.use('/followships', authenticated, authenticateUser, followships)

router.use('/', apiErrorHandler)

module.exports = router
