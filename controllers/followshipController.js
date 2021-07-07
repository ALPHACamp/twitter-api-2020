const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {

  addFollowing: async (req, res, next) => {
    try {
      const [follow, created] = await Followship.findOrCreate({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: Number(req.params.id)
        }
      })
      if (created) {
        return res.json({ status: 'success', message: { isFollowed: true, message: '追蹤成功' } })
      }
      if (follow) {
        return res.json({ status: 'error', message: { isFollowed: true, message: '已經追蹤' } })
      }
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

      if (!followingShip) { return res.json({ status: 'error', message: '使用者沒有追蹤的人' }) }
      followingShip.destroy()

      return res.json({ status: 'success', message: '已取消追蹤' })
    } catch (err) { next(err) }
  },
}

module.exports = followshipController