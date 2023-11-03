const passport = require('../config/passport') // 引入 passport
const helpers = require('../_helpers')
const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  console.log("999999",helpers.getUser(req),"999999")
  if (helpers.getUser(req).role==='admin' ) return next()
  return res.status(403).json({ status: 'error', message: 'permission denied' })
}
module.exports = {
  authenticated,
  authenticatedAdmin
}
