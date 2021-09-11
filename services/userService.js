const { User, Tweet, Reply, Like } = require('../models')

const userService = {
  signIn: async (account) => {
    return await User.findOne({ where: { account } })
  }
}

module.exports = userService
