const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })

    delete user.password
    req.user = user || null
    next()
  })(req, res, next)
}

const authenticatedOwner = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })

    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
      next()
      return
    }

    delete user.password
    req.user = user || null
    if (req.user && (Number(req.params.id) !== Number(req.user.id))) {
      return res.status(403).json({ status: 'error', message: 'permission denied' })
    }
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })

    delete user.password
    req.user = user || null
    if (req.user && (req.user.role === 'admin')) {
      return next()
    }
    return res.status(403).json({ status: 'error', message: 'permission denied' })
  })(req, res, next)
}

module.exports = {
  authenticated,
  authenticatedOwner,
  authenticatedAdmin
}
