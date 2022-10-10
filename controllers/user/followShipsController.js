const { User, Followship } = require('../../models')
const helpers = require('../../_helpers')
const assert = require('assert')

const followShipsCotroller = {
  addFollow: async (req, res, next) => {
    const followerId = helpers.getUser(req).id
    const followingId = req.body.id
    try {
      const [follower, following] = await Promise.all([
        User.findByPk(followerId),
        User.findByPk(followingId)
      ])
      assert(follower, '使用者不存在')
      assert(following, '追蹤對象不存在')

      const followShip = await Followship.findOne({
        where: { followerId, followingId }
      })
      assert(!followShip, '不能重複追蹤')

      const followed = await Followship.create({ followerId, followingId })
      res.status(200).json({
        staus: 'success',
        data: followed
      })
    } catch (error) {
      next(error)
    }
  },
  removeFollow: async (req, res, next) => {
    const followerId = helpers.getUser(req).id
    const followingId = req.params.followingId
    assert(!(followerId === followingId), '不能追蹤自己')
    try {
      const [follower, following] = await Promise.all([
        User.findByPk(followerId),
        User.findByPk(followingId)
      ])
      assert(follower, '使用者不存在')
      assert(following, '追蹤對象不存在')

      const followShip = await Followship.findOne({
        where: { followerId, followingId }
      })
      assert(followShip, '已不在追蹤清單')
      const deleted = await followShip.destroy()

      res.status(200).json({
        staus: 'success',
        data: deleted
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = followShipsCotroller
