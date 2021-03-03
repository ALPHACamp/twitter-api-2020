const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const helpers = require('../_helpers');
const userController = require('../controllers/api/userControllers');
const followshipController = require('../controllers/api/followshipControllers');
//尚未完成
const authenticated = passport.authenticate('jwt', { session: false });

const authenticatedAdmin = (req, res, next) => {
  if (helpers.getUser(req)) {
    if (helpers.getUser(req).isAdmin) {
      return next();
    }
    return res.json({ status: 'error', message: 'permission denied' });
  } else {
    return res.json({ status: 'error', message: 'permission denied' });
  }
};

router.post('/signin', userController.signIn);

//followship
router.get('/following', followshipController.getFollowing);
router.get('/follower', followshipController.getFollower);
router.post('/following/:id', followshipController.postFollowship);
router.delete('/following/:id', followshipController.deleteFollowship);

module.exports = router;
