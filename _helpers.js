const passport = require('passport')

const ensureAuthenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return res.redirect('/api/signin')
    }
    if (user.role === 'user') {
      req.user = { ...user }
      return next()
    } else {
      return res.redirect('/api/signin')
    }
  })(req, res, next)
}

const ensureAuthenticatedAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err)  {
      return res.redirect('/api/signin')
    }
    if (user.role === 'admin') {
      req.user = { ...user }
      return next()
    } else {
      return res.redirect('/api/tweets')
    }
  })(req, res, next)
}

const getUser = (req) => {
  return req.user;
}

module.exports = {
  ensureAuthenticated,
  ensureAuthenticatedAdmin,
  getUser,
};