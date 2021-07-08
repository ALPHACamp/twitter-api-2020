function getUser(req) {
  return req.user;
}


const { helpers } = require('faker');
const passport = require('./config/passport')

// const authenticated = passport.authenticate('jwt', { session: false })
function authenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (error, user) => {
    if (!user) { return res.json({ status: 'error', message: 'No jwt token,請先登入' }) }
    if (error) { return res.json({ status: 'error', message: error }) }
    req.user = user
    return next()
  })(req, res, next)
}


function authenticatedUser(req, res, next) {
  if (getUser(req)) {
    if (getUser(req).role === 'user') { return next() }
    return res.json({ status: 'error', message: '僅限使用者' })
  }
  return res.json({ status: 'error', message: '請先登入' })
}

function authenticatedAdmin(req, res, next) {
  if (getUser(req)) {
    if (req.user.role === 'admin') { return next() }
    return res.json({ status: 'error', message: '管理員專用' })
  }
  return res.json({ status: 'error', message: '請先登入' })
}



module.exports = {
  getUser,
  authenticatedUser,
  authenticatedAdmin,
  authenticated
};
