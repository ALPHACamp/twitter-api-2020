const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const followingShip = await Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: Number(req.params.id)
      })
      if (followingShip) {
        return res.json([followingShip, { status: 'success', message: '追蹤成功' }])
      }
      return res.json({ status: 'error', message: '追蹤失敗' })
    } catch (err) { next(err) }
  },
  deleteFollowing: async (req, res, next) => {
    try {
      const followingShip = await Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: Number(req.params.id)
        }
      }) || false

      if (!followingShip) { return res.json({ status: 'error', message: '沒有追隨的人' }) }
      followingShip.destroy()

      return res.json([followingShip, { status: 'success', message: '取消追蹤' }])
    } catch (err) { next(err) }
  },
}

module.exports = followshipController