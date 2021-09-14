const helpers = require('../_helpers')
const homeController = require('../controllers/homeController')
const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')

const authenticated = (req, res, next) => {
  helpers.getUser(req).role === 'user' ? next() : res.redirect('/api/signin')
}

const authenticatedAdmin = (req, res, next) => {
  helpers.getUser(req).role === 'admin' ? next() : res.redirect('/api/tweets')
}

module.exports = (app, passport) => {
    // home 路由
    app.get('/api/signup', homeController.signUp)

    app.get('/api/signin', homeController.signIn)

    app.get('/api/signin/admin', homeController.signInAdmin)

    app.get('/api/logout', homeController.logout)

    app.post('/api/signin', homeController.postSignIn)

    app.post('/api/users', homeController.postSignUp)

    // tweet路由
    app.get('/api/tweets', helpers.ensureAuthenticated, authenticated, tweetController.homePage)

    // user 路由
  app.get('/api/users/:id', helpers.ensureAuthenticated, authenticated, userController.userHomePage)

  app.get('/api/users/:id/tweets', helpers.ensureAuthenticated, authenticated, userController.getUserTweets)

  app.get('/api/users/:id/replied_tweets', helpers.ensureAuthenticated, authenticated, userController.getRepliedTweets)

  app.get('/api/users/:id/likes', helpers.ensureAuthenticated, authenticated, userController.getLikes)

  app.get('/api/users/:id/followings', helpers.ensureAuthenticated, authenticated, userController.getFollowings)

  app.get('/api/users/:id/followers', helpers.ensureAuthenticated, authenticated, userController.getFollowers)

    //  admin 路由
  app.get('/api/admin', helpers.ensureAuthenticated, authenticatedAdmin, adminController.getTweets)
}
