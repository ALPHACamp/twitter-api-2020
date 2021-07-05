const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const passport = require('../config/passport')
const { helpers } = require('faker')
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'admin') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  }
  return res.json({ status: 'error', message: 'permission denied' })
}

const authenticatedUser = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'user') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  }
  return res.json({ status: 'error', message: 'permission denied' })
}

router.post('/', userController.signup)
router.post('/signin', userController.signin)

module.exports = router