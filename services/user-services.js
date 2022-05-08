const { User } = require('../models')

const userController = {
  register: async (req, cb) => {
    try {
      const user = await User.create(req.body)
      cb(null, user)
    } catch (err) {
      cb(err)
    }
  }
}
module.exports = userController
