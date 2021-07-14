const { User } = require('../models')
const helpers = require('../_helpers')

const currentUserController = {
  getCurrentUser: async (req, res, next) => {
    try {
      const user = await User.findByPk(helpers.getUser(req).id, {
        attributes: ['id', 'role', 'name', 'account', 'email', 'avatar']
      })
      if (!user) return res.json({ status: 'error', message: '查無目前登入者的資訊' })
      return res.json(user)
    }
    catch (err) {
      next(err)
    }
  }
}

module.exports = currentUserController