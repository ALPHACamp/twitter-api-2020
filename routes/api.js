const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const helpers = require('../_helpers');
const multer = require('multer');
const upload = multer({ dest: 'temp/' });
const cpUpload = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
]);
const userController = require('../controllers/api/userControllers');
const tweetController = require('../controllers/api/tweetControllers');
const likeController = require('../controllers/api/likeControllers');
const followshipController = require('../controllers/api/followshipControllers');
const replyController = require('../controllers/api/replyController');
const adminController = require('../controllers/api/adminController');

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'permission denied!!' });
    }
    req.user = user;
    return next();
  })(req, res, next);
};

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).role === 'admin') {
      return next();
    }
    return res.status(401).json({ status: 'error', message: 'permission denied' });
  } else {
    return res.status(401).json({ status: 'error', message: 'permission denied' });
  }
};

//followship
router.post('/followships', authenticated, followshipController.postFollowship);
router.delete('/followships/:followingId', authenticated, followshipController.deleteFollowship);


//user
router.get('/users/currentUser', authenticated, userController.getCurrentUser)
router.get('/users/top10Users', authenticated, userController.getTop10Users);
router.get('/users/other', authenticated, userController.others);
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getReplyTweet)
router.get('/users/:id/followings', authenticated, userController.getFollowing)
router.get('/users/:id/followers', authenticated, userController.getFollower)
router.get('/users/:id/likes', authenticated, userController.getLikeTweets)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, cpUpload, userController.putUser)
router.post('/signin', userController.signIn)
router.post('/users', userController.signUp)


//tweet
router.get('/tweets/:id', authenticated, tweetController.getTweet);
router.get('/tweets', authenticated, tweetController.getTweets);
router.post('/tweets', authenticated, tweetController.postTweets);

//reply
router.get('/tweets/:tweet_id/replies', authenticated, replyController.getReplies);
router.post('/tweets/:tweet_id/replies', authenticated, replyController.postReplies);

//like
router.post('/tweets/:id/like', authenticated, likeController.Like);
router.post('/tweets/:id/unlike', authenticated, likeController.UnLike);

//admin
router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet);
router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets);
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers);
router.post('/admin/signin', adminController.signIn);


module.exports = router;
