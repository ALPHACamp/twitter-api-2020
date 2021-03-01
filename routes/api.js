const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const helpers = require('../_helpers')
const userController = require('../controllers/api/userControllers')


const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) { return next(err) }
    if (!user) {
      return res.status(401).json({ status: 'error', message: "permission denied!!" })
    }
    req.user = user
    return next()
  })(req, res, next)
}


const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req) === 'admin') { return next() }
    return res.status(401).json({ status: 'error', message: 'permission denied' })
  } else {
    return res.status(401).json({ status: 'error', message: 'permission denied' })
  }
}


router.get('/users/:id', authenticated, userController.getUser)
router.post('/signin', userController.signIn)
router.post('/users', userController.signUp)



module.exports = router