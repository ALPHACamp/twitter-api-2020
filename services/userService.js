const { User, Tweet, Reply, Like } = require('../models')

const userService = {
  signIn: async (account) => {
    return await User.findOne({ where: { account } })
  },
  getCurrentUser: async (id) => {
    return await User.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Like }
      ]
    })
  },
}

module.exports = userService
