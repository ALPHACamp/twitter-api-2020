const { getUser } = require('../../_helpers')

const userController = {
  login: async (req, res, next) => {
    try {
      const userData = getUser(req).toJSON()
      delete userData.password
      res.json({ status: 'success', data: userData })
    } catch (error) {
      next(error)
    }
  },
  signUp: (req, res, next) => { }
}

module.exports = userController
