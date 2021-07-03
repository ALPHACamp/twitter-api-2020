const { User } = require('../models')

const userService = {
  signIn: async (email) => {
    return await User.findOne({
      where: { email }
    })
  }
}

module.exports = userService
