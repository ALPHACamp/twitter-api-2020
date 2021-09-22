const passport = require('passport')

const ensureAuthenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    req.user = { ...user.dataValues }
    if (err) {
      return res.json({ status: 'error', message: 'permission denied' })
    }
    if (user.role === 'user') {
      return next()
    } else {
      // return next()
      return res.json({ status: 'error', message: 'permission denied' })
    }
  })(req, res, next)
}

const ensureAuthenticatedAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    req.user = { ...user.dataValues }
    if (err)  {
      return res.json({ status: 'error', message: 'permission denied' })
    }
    if (user.role === 'admin') {
      return next()
    } else {
      // return next()
      return res.json({ status: 'error', message: 'permission denied' })
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