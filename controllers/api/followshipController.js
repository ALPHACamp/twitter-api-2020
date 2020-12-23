const { User, Followship, Like, Sequelize, sequelize } = require('../../models')
const helpers = require('../../_helpers.js')

const followshipController = {

  deleteFollowing: async (req, res, next) => {
    try {
      const followingId = Number(req.params.followingId)
      if (!followingId) return res.status(400).json({ status: 'error', message: '無效的使用者id' })
      const followerId = helpers.getUser(req).id
      const followship = await Followship.findOne({ where: { followingId, followerId } })
      if (!followship) return res.json({ status: 'success', message: '未追蹤' })
      await followship.destroy()
      return res.json({ status: 'success', message: '已取消追蹤' })
    } catch (error) {
      next(error)
    }
  },

  addFollowing: async (req, res, next) => {
    try {
      const followingId = Number(req.body.id)
      if (!followingId) return res.status(400).json({ status: 'error', message: '無效的使用者id' })
      const followings = helpers.getUser(req).Followings
      if (followings && followings.includes(followingId)) return res.json({ status: 'success', message: '已追蹤' })
      const followerId = helpers.getUser(req).id
      if (followingId === followerId) return res.status(400).json({ status: 'error', message: '不能追蹤自己' })
      await Followship.findOrCreate({ where: { followingId, followerId } })
      return res.json({ status: 'success', message: '已追蹤' })
    } catch (error) {
      next(error)
    }
  },

}

module.exports = followshipController