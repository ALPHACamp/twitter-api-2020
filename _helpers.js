const passport = require('./config/passport')
const passport1 = require('./config/passport1')

const ensureAuthenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    req.user = { ...user.dataValues }
    if (err) {
      return res.json({ status: 'error', message: 'permission denied' })
    }
    return next()
  })(req, res, next)
}

const ensureAuthenticatedAdmin = (req, res, next) => {
  passport1.authenticate('jwt', { session: false }, (err, user) => {
    req.user = { ...user.dataValues }
    if (err)  {
      return res.json({ status: 'error', message: 'permission denied' })
    }
    return next()
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