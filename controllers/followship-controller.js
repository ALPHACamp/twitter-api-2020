const helper = require('../_helpers')
const { User, Followship } = require('../models')

const followshipController = {
  addFollowships: async (req, res, next) => {
    try {
      const followingId = req.body.id
      const followerId = helper.getUser(req).id
      const users = await Promise.all([
        User.findByPk(followingId),
        User.findByPk(followerId)
      ])
      if (!users[0] || !users[1]) throw new Error('使用者不存在')
      const followship = await Followship.findOne({ where: { followingId, followerId } })
      if (followship) throw new Error('已追蹤對方')
      await Followship.create({ followingId, followerId })
      res.end()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followshipController
