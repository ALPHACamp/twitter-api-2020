const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const helpers = require('../_helpers');
const userController = require('../controllers/api/userControllers');
const tweetController = require('../controllers/api/tweetControllers');
const likeController = require('../controllers/api/likeControllers');
const followshipController = require('../controllers/api/followshipControllers');

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
    if (helpers.getUser(req) === 'admin') {
      return next();
    }
    return res.status(401).json({ status: 'error', message: 'permission denied' });
  } else {
    return res.status(401).json({ status: 'error', message: 'permission denied' });
  }
};

router.post('/signin', userController.signIn);

//followship
router.get('/following', followshipController.getFollowing);
router.get('/follower', followshipController.getFollower);
router.post('/followships/:followingId', followshipController.postFollowship);
router.delete('/followships/:followingId', followshipController.deleteFollowship);

//user
router.get('/users/:id', authenticated, userController.getUser);
router.post('/signin', userController.signIn);
router.post('/users', userController.signUp);

//tweet
router.get('/tweets/:id', authenticated, tweetController.getTweet);
router.get('/tweets', authenticated, tweetController.getTweets);
router.post('/tweets', authenticated, tweetController.postTweets);

//like
router.post('/tweets/:id/like', authenticated, likeController.Like);
router.post('/tweets/:id/unlike', authenticated, likeController.UnLike);

module.exports = router;
