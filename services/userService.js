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
  },
  putUser: async (id, body) => {
    // TODO: Need to check 'email' and 'account' are both unique.
    // const existAccount = await User.fineOne({ where: { account: body.account } })
    // if (existAccount) throw new Error('This account name is already exist.')
    const user = await User.update(
      { ...body },
      { where: { id } }
    )
    return user
  }
}

module.exports = userService
