const helpers = require('../_helpers')
module.exports = {
  isUser: req => {
    const signInUserId = helpers.getUser(req).id
    const userId = Number(req.params.id)
    const isSelfUser = signInUserId === userId
    return isSelfUser
  }
}
