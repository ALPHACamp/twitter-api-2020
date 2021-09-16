const helpers = require('../_helpers')
const homeController = require('../controllers/homeController')
const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const followshipController = require('../controllers/followshipController')


module.exports = (app, passport) => {
  
  const authenticated = (req, res, next) => {
    if (helpers.getUser(req).role === 'user') {
      return next()
    }
    res.redirect('/api/signin')
  }
  
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.getUser(req).role === 'admin') {
      return next()
    }
    res.redirect('/api/tweets')
  }

    // home 路由
  app.get('/api/signup', homeController.signUp)

  app.get('/api/signin', homeController.signIn)

  app.get('/api/signin/admin', homeController.signInAdmin)

  app.get('/api/logout', homeController.logout)

  app.post('/api/signin', homeController.postSignIn)

  app.post('/api/users', homeController.postSignUp)

  // tweet路由
  app.get('/api/tweets', helpers.ensureAuthenticated, authenticated, tweetController.homePage)

  app.get('/api/tweets/:id', helpers.ensureAuthenticated, authenticated, tweetController.getTweet)

  app.post('/api/tweets', helpers.ensureAuthenticated, authenticated, tweetController.postTweet)

  app.post('/api/tweets/:id/replies', helpers.ensureAuthenticated, authenticated, tweetController.postTweetReply)

  app.post('/api/tweets/:id/like', helpers.ensureAuthenticated, authenticated, tweetController.postLike)

  app.post('/api/tweets/:id/unlike', helpers.ensureAuthenticated, authenticated, tweetController.postUnlike)

    // user 路由
  app.get('/api/users/:id', helpers.ensureAuthenticated, authenticated, userController.userHomePage)

  app.get('/api/users/:id/tweets', helpers.ensureAuthenticated, authenticated, userController.getUserTweets)

  app.get('/api/users/:id/replied_tweets', helpers.ensureAuthenticated, authenticated, userController.getRepliedTweets)

  app.get('/api/users/:id/likes', helpers.ensureAuthenticated, authenticated, userController.getLikes)

  app.get('/api/users/:id/followings', helpers.ensureAuthenticated, authenticated, userController.getFollowings)

  app.get('/api/users/:id/followers', helpers.ensureAuthenticated, authenticated, userController.getFollowers)

    //followship路由
  app.post('/api/followships/:id', helpers.ensureAuthenticated, authenticated, followshipController.follow)

  app.delete('/api/followships/:id', helpers.ensureAuthenticated, authenticated, followshipController.unfollow)

    //  admin 路由
  app.get('/api/admin', helpers.ensureAuthenticated, authenticatedAdmin, adminController.getTweets)

  app.get('/api/admin/users', helpers.ensureAuthenticated, authenticatedAdmin, adminController.getUsers)

  app.delete('/api/admin/tweets/:id', helpers.ensureAuthenticated, authenticatedAdmin, adminController.deleteTweet)
}
