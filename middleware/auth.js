// 注意：由於測試檔對於身份的判別是以 undefined 與否認定，因此以第八行 if (user.role === 'admin')為例，若改成 if (user.role !== 'user') 將導致無法通過測試。
const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    req.user = user
    if (user.role === 'admin')return res.status(401).json({ status: 'error', message: 'unauthorized' })
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
    req.user = user
    if (req.user.role === 'user') return res.status(401).json({ status: 'error', message: 'unauthorized' })
    next()
  })(req, res, next)
}


const authenticatedBasic = 
  (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user) return res.status(401).json({ status: 'error', message: 'unauthorized' })
      req.user = user
      next()
    })(req, res, next)
  }



module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedBasic
}
