const passport = require('passport')

const ensureAuthenticated = passport.authenticate('jwt', { session: false, failureRedirect: '/api/signin' });

// function ensureAuthenticated(req) {
//   return req.isAuthenticated();
// }

const getUser = (req) => {
  return req.user;
}

module.exports = {
  ensureAuthenticated,
  getUser,
};