const { User, Tweet, Reply } = require('../models')
const helpers = require('../_helpers')

const adminController = {
  getAllUser: async (req, res, next) => {
    try {
      const user = await User.findAll()
      return res.json(user)
    } catch (err) { next(err) }
  },


}

module.exports = adminController