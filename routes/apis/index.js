const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')

const userRoute = require('./userRoute')
const tweetRoute = require('./tweetRoute')
const followshipRoute = require('./followshipRoute')
const adminRoute = require('./adminRoute')

const userController = require('../../controllers/userController')

const authenticated = passport.authenticate('jwt', { session: false })
const checkRole = (role = 'user') => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return next(new Error('Permission denied.'))
    }
    return next()
  }
}

router.post('/signin', userController.signIn)

router.use('/users', userRoute)
router.use('/tweets', authenticated, checkRole(), tweetRoute)
router.use('/followships', authenticated, checkRole(), followshipRoute)
router.use('/admin', authenticated, checkRole('admin'), adminRoute)

module.exports = router
