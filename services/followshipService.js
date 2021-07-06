const { Followship } = require('../models')

const followshipService = {
  addFollow: async (a, b) => {
    const [, created] = await Followship.findOrCreate({ where: { followerId: a, followingId: b } })
    if (!created) {
      throw new Error('there is a same data found before create')
    }
    return { status: 'success', message: 'A followship has created' }
  },

  unFollow: async (a, b) => {
    await Followship.destroy({ where: { followerId: a, followingId: b } })
    return { status: 'success', message: 'A followship has destroy' }
  }
}

module.exports = followshipService
