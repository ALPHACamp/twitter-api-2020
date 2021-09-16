const passport = require('passport')

// const ensureAuthenticated = passport.authenticate('jwt', { session: false, failureRedirect: '/api/signin' });

const ensureAuthenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return res.redirect('/api/signin')
    } else {
      if (!user) {
        return res.redirect('/api/signin')
      } else {
        return next()
      }
    }
  })(req, res, next)
}

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