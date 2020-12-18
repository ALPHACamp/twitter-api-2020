const { User, Followship, Like, Sequelize, sequelize } = require('../../models')
const helpers = require('../../_helpers.js')

const followshipController = {

  deleteFollowing: async (req, res, next) => {
    try {
      const followingId = Number(req.params.id)
      if (!followingId) return res.status(400).json({ status: 'error', message: '無效的使用者id' })
      if (!helpers.getUser(req).Followings.includes(followingId)) return res.json({ status: 'success', message: '未追蹤' })
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
      console.log('@@1', followingId)
      if (!followingId) return res.status(400).json({ status: 'error', message: '無效的使用者id' })
      console.log('@@2')
      if (helpers.getUser(req).Followings.includes(followingId)) return res.json({ status: 'success', message: '已追蹤' })
      const followerId = helpers.getUser(req).id
      console.log('@@3', followerId)
      if (followingId === followerId) return res.status(400).json({ status: 'error', message: '不能追蹤自己' })
      console.log('@@4', followerId)
      const followship = await Followship.findOrCreate({ followingId, followerId })

      console.log('@@5', followship)
      const data = await Followship.findByPk(1)
      console.log('@@6', data)
      return res.json({ status: 'success', message: '已追蹤' })
    } catch (error) {
      next(error)
    }
  },

}

module.exports = followshipController