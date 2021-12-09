const helpers = require('../_helpers')

module.exports = {
  replaceReqUser: (req, res, next) => {
    req.user = helpers.getUser(req)
    next()
  }
}
