const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })
module.exports = {
  authenticated
}
