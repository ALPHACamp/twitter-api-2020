const passport = require('./config/passport')
const passportAdmin = require('./config/passport1')

const ensureAuthenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    console.log("🚀 ~ file: _helpers.js ~ line 6 ~ passport.authenticate ~ user", user)
    req.user = { ...user.dataValues }
    if (err) {
      return res.json({ status: 'error', message: 'permission denied' })
    }
    if (user) {
      return next()
    } else {
      return res.json({ status: 'error', message: 'permission rejected' })
    }
  })(req, res, next)
}

const ensureAuthenticatedAdmin = (req, res, next) => {
  passportAdmin.authenticate('jwtAdmin', { session: false }, (err, user) => {
    console.log("🚀 ~ file: _helpers.js ~ line 20 ~ passport1.authenticate ~ user", user)
    req.user = { ...user.dataValues }
    if (err)  {
      return res.json({ status: 'error', message: 'permission denied' })
    }
    if (user) {
      return next()
    } else {
      return res.json({ status: 'error', message: 'permission rejected' })
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