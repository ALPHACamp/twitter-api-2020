const assert = require('assert')

const { User } = require('../models')
const { getOffset } = require('../_helpers')

const superUser = { name: 'root', email: 'root@example.com' }

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
  },
  patchUser: async (req, res, next) => {
    try {
      const { role } = req.body
      const { id } = req.params
      const user = await User.findByPk(id)
      if (user.email === superUser.email) assert(user, `禁止變更${superUser.name}權限`)
      const updateUser = await user.update({ role })
      res.json({ status: 'success', data: updateUser })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
