const { Message, User } = require('../models')

const socketService = {
  getUser: async (userId, next) => {
    try {
      const data = await User.findByPk(userId, { attributes: ['id', 'account', 'name', 'avatar'] })

      return data.toJSON()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = socketService
