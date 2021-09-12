const { User, Tweet, Reply, Like } = require('../models')
const bcrypt = require('bcryptjs')

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

  postUser: async (body) => {
    const { account, name, email, password } = body
    // If the account is not duplicate, register the account
    const [user, created] = await User.findOrCreate({
      where: { account },
      defaults: {
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      }
    })
    
    // Check whether the user is already exists
    if (created) {
      return { status: 'error', message: 'Account already exists' }
    }

    return { status: 'success', message: 'Account already exists' }
  }
}

module.exports = userService
