const passport = require('../config/passport');
const helpers = require('../_helpers');

// General User'account authentication
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user)
      return res
        .status(401)
        .json({ status: 'error', message: 'Unauthorized !!' });

    req.user = user;
    return next();
  })(req, res, next);
};

// Admin account authentication
const authenticatedAdmin = (req, res, next) => {
  return helpers.getUser(req).role !== 'admin'
    ? res
        .status(401)
        .json({ status: 'error', message: `You don't have permission right` })
    : next();
};

// Prevent admin from accessing the front-end system
const authenticatedUser = (req, res, next) => {
  return helpers.getUser(req).role !== 'admin'
    ? next()
    : res.status(401).json({
        status: 'error',
        message: `Admin didn't have permission to Front-end system`,
      });
};

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedUser,
};
