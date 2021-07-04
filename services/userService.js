const { User } = require('../models')

const userService = {
  signIn: async (email) => {
    return await User.findOne({
      where: { email }
    })
  },
  signUp: async (formBody) => {
    const [user, created] = await User.findOrCreate({
      where: { email: formBody.email },
      defaults: {
        ...formBody
      }
    })
    if (!created) throw new Error('This email is already exist.')
    return user
  }
}

module.exports = userService
