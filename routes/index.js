const router = require('express').Router()
const tweets = require('./tweets')
const users = require('./users')
const home = require('./home')
const followships = require('./followships')
const admin = require('./admin')
const helpers = require('../_helpers')

const authenticated = (req, res, next) => {
  helpers.getUser(req).role === 'user' ? next() : res.redirect('/api/signin')
}

const authenticatedAdmin = (req, res, next) => {
  helpers.getUser(req).role === 'admin' ? next() : res.redirect('/api/tweets')
}
router.use('/api', home)
router.use('/api/users', helpers.ensureAuthenticated, authenticated, users)
router.use('/api/admin', helpers.ensureAuthenticated, authenticatedAdmin, admin)
router.use('/api/followships', helpers.ensureAuthenticated, authenticated, followships)
router.use('/api/tweets', helpers.ensureAuthenticated, authenticated, tweets)

module.exports = router