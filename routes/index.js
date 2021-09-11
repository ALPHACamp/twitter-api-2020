const router = require('express').Router()
const tweets = require('./tweets')
const users = require('./users')
const home = require('./home')
const followships = require('./followships')
const admin = require('./admin')
const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    return next()
  }
  return res.redirect('/api/signin')
}

const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).role === 'admin') { return next() }
    const userId = req.user.id
    return res.redirect(`/api/users/${userId}`)
  }
  return res.redirect('/api/signin')
}

router.use('/api', home)
router.use('/api/users', authenticated, users)
router.use('/api/tweets', authenticated, tweets)
router.use('/api/followships', authenticated, followships)
router.use('/api/admin', authenticatedAdmin, admin)

module.exports = router