const router = require('express').Router()
const passport = require('../config/passport')
const userRoute = require('./user')
const adminRoute = require('./admin')
const tweetsRoute = require('./user/tweets')
const followshipsRoute = require('./user/followships')
const userController = require('../controllers/user/userController')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  userController.signIn
)
router.use('/users', userRoute)
router.use('/admin', adminRoute)
router.use('/tweets', authenticated, tweetsRoute)
router.use('/followships', authenticated, followshipsRoute)

router.get('/test', (req, res) => {
  console.log('GET:test: req.query', req?.query)
  console.log('GET:test: req.params', req?.params)
})
router.post('/test', (req, res) => {
  console.log('POST:test req.body', req.body)
  console.log('POST:test: req.query', req?.query)
  console.log('POST:test: req.params', req?.params)
})
router.use('/', apiErrorHandler)

module.exports = router
