// const router = require('express').Router()
// const tweets = require('./tweets')
// const users = require('./users')
// const home = require('./home')
// const followships = require('./followships')
// const admin = require('./admin')
// const app = require('../app')
const helpers = require('../_helpers')
const homeController = require('../controllers/homeController')
const tweetController = require('../controllers/tweetController')

const authenticated = (req, res, next) => {
  helpers.getUser(req).role === 'user' ? next() : res.redirect('/api/signin')
}

const authenticatedAdmin = (req, res, next) => {
  helpers.getUser(req).role === 'admin' ? next() : res.redirect('/api/tweets')
}

module.exports = (app, passport) => {
  // app.use('/api', home)
  // app.use('/api/users', helpers.ensureAuthenticated, authenticated, users)
  // app.use('/api/admin', helpers.ensureAuthenticated, authenticatedAdmin, admin)
  // app.use('/api/followships', helpers.ensureAuthenticated, authenticated, followships)
  // app.use('/api/tweets', helpers.ensureAuthenticated, authenticated, tweets)
    app.get('/signup', homeController.signUp)

    app.get('/signin', homeController.signIn)

    app.get('/signin/admin', homeController.signInAdmin)

    app.get('/logout', homeController.logout)

    app.post('/signin', homeController.postSignIn)

    app.post('/users', homeController.postSignUp)

    app.get('/', helpers.ensureAuthenticated, authenticated, tweetController.homePage)
}

// module.exports = router