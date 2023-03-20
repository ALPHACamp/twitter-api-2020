const express = require('express');

const router = express.Router();
const passport = require('passport');

const admin = require('./modules/admin');

const users = require('./modules/users');

const {
  authenticated,
  authenticatedAdmin,
  authenticatedUser,
} = require('../middleware/api-auth');

const { apiErrorHandler } = require('../middleware/error-handle');

router.use('/admin', authenticated, authenticatedAdmin, admin);

router.use('/users', authenticated, authenticatedUser, users);

router.get('/', (req, res) =>
  res.send(`You did not pass the authentication. Here is routes/index.js
`)
);

router.use('/', apiErrorHandler);

module.exports = router;
