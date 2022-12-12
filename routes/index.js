const express = require('express')
const router = express.Router()
const helpers = require('../_helpers')

// use helpers.getUser(req) to replace req.user
function authenticated(req, res, next) {
  // passport.authenticate('jwt', { ses...
};

module.exports = router
