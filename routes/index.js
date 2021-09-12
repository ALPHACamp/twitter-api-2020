const router = require('express').Router()
const tweets = require('./tweets')
const users = require('./users')
const home = require('./home')
const followships = require('./followships')
const admin = require('./admin')
const helpers = require('../_helpers')


const authenticatedLogin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return res.redirect('/api/tweets')
  }
  return next()
}

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  return res.redirect('/api/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') { return next() }
    return res.redirect('/api/tweets')
  }
  return res.redirect('/api/signin')
}

router.use('/api/users', authenticated, users)
router.use('/api/tweets', authenticated, tweets)
router.use('/api/followships', authenticated, followships)
router.use('/api/admin', authenticatedAdmin, admin)
router.use('/api', authenticatedLogin, home)

module.exports = router