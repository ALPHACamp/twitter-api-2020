const express = require('express');

const router = express.Router();

const passport = require('passport');

const tweet = require('./modules/tweet');

const admin = require('./modules/admin');

const users = require('./modules/users');

const {
  authenticated,
  authenticatedAdmin,
  authenticatedUser,
} = require('../middleware/api-auth');

const { apiErrorHandler } = require('../middleware/error-handler');
const userController = require('../controllers/user-controller');

// register
router.post('/users', userController.signUp);

// login
router.post(
  '/users/signin',
  passport.authenticate('local', { session: false }),
  authenticatedUser,
  userController.signIn
);

router.post(
  '/admin/signin',
  passport.authenticate('local', { session: false }),
  authenticatedAdmin,
  userController.signIn
);

router.use('/admin', authenticated, authenticatedAdmin, admin);

router.use('/users', authenticated, authenticatedUser, users);

router.use('/tweets', authenticated, tweet);

router.get('/', (req, res) =>
  res.send(`You did not pass the authentication. Here is routes/index.js
`)
);

router.use('/', apiErrorHandler);

module.exports = router;
