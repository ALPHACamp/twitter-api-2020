const { Followship } = require('../models')

const followshipService = {
  addFollow: async (a, b) => {
    try {
      const [data, created] = await Followship.findOrCreate({ where: { followerId: a, followingId: b } })
      if (!created) {
        return ({ message: 'there is a same data found before create' })
      }
      return { status: 201, message: 'A followship has created' }
    } catch (error) {
      throw new Error(error)
    }
  },

  unFollow: async (a, b) => {
    try {
      await Followship.destroy({ where: { followerId: a, followingId: b } })
      return { status: 200, message: 'A followship has destroy' }
    } catch (error) {
      throw new Error(error)
    }
  },
}

module.exports = followshipService