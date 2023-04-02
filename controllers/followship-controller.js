const helpers = require('../_helpers')
const { User, Followship } = require('../models')

const followshipController = {
  addFollowships: async (req, res, next) => {
    try {
      const followingId = req.body.id
      const followerId = helpers.getUser(req).id
      if (Number(followingId) === followerId) throw new Error('不可追蹤自己')
      const users = await Promise.all([
        User.findByPk(followingId, { raw: true }),
        User.findByPk(followerId, { raw: true })
      ])
      if (!users[0] || !users[1]) throw new Error('使用者不存在')
      const followship = await Followship.findOne({ where: { followingId, followerId }, raw: true })
      if (followship) throw new Error('已追蹤對方')
      await Followship.create({ followingId, followerId })
      res.status(200).end()
    } catch (err) {
      next(err)
    }
  },
  removeFollowships: async (req, res, next) => {
    try {
      const followingId = req.params.followingId
      const followerId = helpers.getUser(req).id
      const users = await Promise.all([
        User.findByPk(followingId, { raw: true }),
        User.findByPk(followerId, { raw: true })
      ])
      if (!users[0] || !users[1]) throw new Error('使用者不存在')
      const followship = await Followship.findOne({ where: { followingId, followerId }, attribute: [] })
      if (!followship) throw new Error('尚未追蹤對方')
      await followship.destroy()
      res.status(200).end()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followshipController
