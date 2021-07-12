const { User, Followship } = require('../models')
const helpers = require('../_helpers')
const { Op } = require("sequelize")
const Sequelize = require('sequelize')

const followshipController = {

  showAllUser: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限一般使用者使用' })
      let users = await User.findAll({
        limit: 10,
        where: {
          id: { [Op.ne]: helpers.getUser(req).id },
          role: { [Op.eq]: 'user' }
        },
        attributes: [
          'id',
          'name',
          'account',
          'avatar',
          [Sequelize.literal('(SELECT COUNT (*) FROM Followships WHERE followingId = User.id)'), 'totalFollowers'],
          [Sequelize.literal(`(SELECT EXISTS (SELECT * FROM Followships WHERE followingId = User.id AND followerId = ${helpers.getUser(req).id}))`), 'isFollowing']
        ],
        order: [[Sequelize.literal('totalFollowers'), 'DESC']]
      })
      return res.json(users)
    }
    catch (err) {
      next(err)
    }
  },

  addFollowing: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限一般使用者使用' })
      if (helpers.getUser(req).id === Number(req.body.id)) {
        return res.json({ status: 'error', message: '無法追蹤自己' })
      }
      const [follow, created] = await Followship.findOrCreate({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: Number(req.body.id)
        }
      })
      if (created) {
        return res.json({ status: 'success', message: '追蹤成功' })
      }
      return res.json({ status: 'error', message: '已追蹤過了' })
    }
    catch (err) {
      next(err)
    }
  },

  deleteFollowing: async (req, res, next) => {
    try {
      if (helpers.getUser(req).role !== 'user') return res.json({ status: 'error', message: '僅限一般使用者使用' })
      const followingShip = await Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: Number(req.params.id)
        }
      })
      if (!followingShip) { return res.json({ status: 'error', message: '使用者沒有追蹤的人' }) }
      await followingShip.destroy()
      return res.json({ status: 'success', message: '已取消追蹤' })
    }
    catch (err) {
      next(err)
    }
  },
}

module.exports = followshipController