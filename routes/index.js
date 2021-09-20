const helpers = require('../_helpers')
const homeController = require('../controllers/homeController')
const tweetController = require('../controllers/tweetController')
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const followshipController = require('../controllers/followshipController')


module.exports = (app, passport) => {

    // home 路由
  app.get('/api/signup', homeController.signUp)

  app.get('/api/signin', homeController.signIn)

  app.get('/api/signin/admin', homeController.signInAdmin)

  app.get('/api/logout', homeController.logout)

  app.post('/api/signin', homeController.postSignIn)

  app.post('/api/users', homeController.postSignUp)

  // tweet路由
  app.get('/api/tweets', helpers.ensureAuthenticated, tweetController.homePage)

  app.get('/api/tweets/:id/top10', helpers.ensureAuthenticated, tweetController.getTop10Twitter)
  
  app.get('/api/tweets/:id/replies', helpers.ensureAuthenticated, tweetController.getTweetReplies) //增加

  app.get('/api/tweets/:id', helpers.ensureAuthenticated, tweetController.getTweet)

  app.post('/api/tweets', helpers.ensureAuthenticated, tweetController.postTweet)

  app.post('/api/tweets/:id/replies', helpers.ensureAuthenticated, tweetController.postTweetReply)

  app.post('/api/tweets/:id/like', helpers.ensureAuthenticated, tweetController.postLike)

  app.post('/api/tweets/:id/unlike', helpers.ensureAuthenticated, tweetController.postUnlike)

  // user 路由
  app.get('/api/users/:id/tweets', helpers.ensureAuthenticated, userController.getUserTweets)
  
  app.get('/api/users/:id/replied_tweets', helpers.ensureAuthenticated, userController.getRepliedTweets)
  
  app.get('/api/users/:id/likes', helpers.ensureAuthenticated, userController.getLikes)
  
  app.get('/api/users/:id/followings', helpers.ensureAuthenticated, userController.getFollowings)
  
  app.get('/api/users/:id/followers', helpers.ensureAuthenticated, userController.getFollowers)

  app.get('/api/users/:id/userInfo', helpers.ensureAuthenticated, userController.getUserInfo)

  app.get('/api/users/:id', helpers.ensureAuthenticated, userController.userHomePage)

  app.put('/api/users/:id', helpers.ensureAuthenticated, userController.editUserData) //增加


    //followship路由
  app.post('/api/followships', helpers.ensureAuthenticated, followshipController.follow) //路由要改

  app.delete('/api/followships/:id', helpers.ensureAuthenticated, followshipController.unfollow)

    //  admin 路由
  app.get('/api/admin', helpers.ensureAuthenticatedAdmin, adminController.getTweets)

  app.get('/api/admin/users', helpers.ensureAuthenticatedAdmin, adminController.getUsers)

  app.delete('/api/admin/tweets/:id', helpers.ensureAuthenticatedAdmin, adminController.deleteTweet)
}
