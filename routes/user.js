const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'admin') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  }
  return res.json({ status: 'error', message: 'permission denied' })
}

const authenticatedUser = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'user') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  }
  return res.json({ status: 'error', message: 'permission denied' })
}


router.get('/', authenticated, authenticatedAdmin, (req, res) => res.json({ key: 'test' }))

router.post('/signup', userController.signup)
router.post('/signin', userController.signin)

module.exports = router