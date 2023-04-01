const passport = require('../config/passport')
const helpers = require('../_helpers') // AC 為了測試要我們改的，用 getUser(...) 取代 req.user
const auth = (req, res, next) => {
  passport.authenticate('jwt', { session: false },
    (err, user) => {
      if (err || !user) return res.status(401).json({ success: false, message: 'Unauthorized' })
      req.user = user
      next()
    })(req, res, next)
}

const isAdmin = (req, res, next) => {
  if (helpers.getUser(req).role === 'admin') return next()
  return res.status(403).json({ success: false, message: 'permission denied. You are user' })
}

const isUser = (req, res, next) => {
  if (helpers.getUser(req).role === 'user') return next()
  return res.status(403).json({ success: false, message: 'permission denied. Your are admin.' })
}
module.exports = {
  auth,
  isAdmin,
  isUser
}
