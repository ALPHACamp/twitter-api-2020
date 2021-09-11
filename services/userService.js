const { User, Tweet, Reply, Like } = require('../models')

const userService = {
  signIn: async (account) => {
    return await User.findOne({ where: { account } })
  },
  getCurrentUser: async (id) => {
    return await User.findOne({
      where: { id },
      attributes: [
        'id',
        'name',
        'account',
        'avatar',
        'introduction',
        'role',
        'cover',
      ],
    })
  },
}

module.exports = userService
