const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const passport = require('../config/passport')

const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'admin') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}


router.get('/', authenticated, authenticatedAdmin, (req, res) => res.json({ key: 1 }))
router.get('/signin', userController.signInPage)

router.get('/signup', userController.signUpPage)

router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)
router.get('/logout', userController.logout)

module.exports = router