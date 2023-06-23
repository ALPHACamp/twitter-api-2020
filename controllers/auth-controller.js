const helpers = require('../_helpers')

const authController = {
  authToken: (req, res, next) => {
    const getUser = helpers.getUser(req)
    const userId = getUser.id
    return res.json({
      status: 'success',
      userId: userId
    })
  }
}

module.exports = authController
