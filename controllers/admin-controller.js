const { User } = require('../models')
const { getOffset } = require('../_helpers')

const adminController = {
  getUsers: async (req, res, next) => {
    try {
      const DEFAULT_LIMIT = 10
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || DEFAULT_LIMIT
      const offset = getOffset(limit, page)

      const users = await User.findAll({
        limit,
        offset,
        nest: true,
        raw: true
      })

      res.json({ status: 'success', data: users })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
