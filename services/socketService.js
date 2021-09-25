const { User } = require('../models')
const apiError = require('../libs/apiError')


const socketService = {
  getUser: async (userId) => {
    console.log('===getUser function===')
    const user = await User.findByPk(userId, {
      raw: true,
      nest: true,
      attributes: ['id', 'name', 'account', 'avatar']
    })

    if (!user) return 

    return user
  }
}

module.exports = socketService