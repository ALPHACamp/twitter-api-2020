const helpers = require('../_helpers')

const authenticated = (err, req, res, next) => {
  if (helpers.ensureAuthenticated(req)) return next()
  return next(err)
}

const authUser = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'user') return next()
  return res.json({
    status: 'error',
    message: 'permission denied'
  })
}

const authAdmin = (req, res, next) => {
  if (helpers.getUser(req)?.role === 'admin') return next()
  return res.json({
    status: 'error',
    message: 'permission denied'
  })
}

module.exports = {
  authenticated,
  authUser,
  authAdmin
}
