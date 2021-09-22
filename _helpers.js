const passport = require('passport')

const ensureAuthenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: true }, (err, user) => {
    req.user = { ...user.dataValues }
    if (err) {
      return res.redirect('/api/signin')
    }
    if (user.role === 'user') {
      return next()
    } else {
      return next()
      // return res.redirect('/api/signin')
    }
  })(req, res, next)
}

const ensureAuthenticatedAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    req.user = { ...user.dataValues }
    if (err)  {
      return res.redirect('/api/signin')
    }
    if (user.role === 'admin') {
      return next()
    } else {
      return next()
      // return res.redirect('/api/signin')
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