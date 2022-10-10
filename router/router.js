const router = require('express').Router()
const passport = require('../config/passport')
const userRoute = require('./user')
const adminRoute = require('./admin')
const tweetsRoute = require('./user/tweets')
const followshipsRoute = require('./user/followships')
const userController = require('../controllers/user/userController')
const adminController = require('../controllers/admin/adminController')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')

// user login
router.post('/login',
  passport.authenticate('local', { session: false }),
  userController.signIn
)
// admin login
router.post('/admin/login',
  passport.authenticate('local', { session: false }),
  adminController.adminSignIn
)
// user register
router.post('/users', userController.signUp)

router.use('/admin', authenticated, authenticatedAdmin, adminRoute)
router.use('/users', authenticated, authenticatedUser, userRoute)
router.use('/tweets', authenticated, authenticatedUser, tweetsRoute)
router.use('/followships', authenticated, authenticatedUser, followshipsRoute)

router.get('/test', (req, res) => {
  console.log('GET:test: req.query', req?.query)
  console.log('GET:test: req.params', req?.params)
  res.json({
    status: 'seccess',
    message: 'get data'
  })
})
router.post('/test', (req, res) => {
  console.log('POST:test req.body', req.body)
  console.log('POST:test: req.query', req?.query)
  console.log('POST:test: req.params', req?.params)
  res.json({
    status: 'seccess',
    message: 'get data'
  })
})
router.use('/', apiErrorHandler)

module.exports = router
