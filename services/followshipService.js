const { Followship } = require('../models')

const RequestError = require('../utils/customError')

const followshipService = {
  addFollow: async (followReq) => {
    const [, created] = await Followship.findOrCreate({ where: followReq })
    if (!created) {
      throw new RequestError('there is a same data found before create')
    }
    return { status: 'success', message: 'A followship has created' }
  },

  unFollow: async (followReq) => {
    await Followship.destroy({ where: followReq })
    return { status: 'success', message: 'A followship has destroy' }
  }
}

module.exports = followshipService
