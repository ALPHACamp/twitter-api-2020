const { User, Followship } = require('../models')
const { newErrorGenerate } = require('../helpers/newError-helper')
const helpers = require('../_helpers')

const followController = {
  // 加入追蹤
  addFollowships: async (req, res, next) => {
    try {
      const followingId = req.body.id
      const followerId = helpers.getUser(req).id

      const [user, followship] = await Promise.all([
        User.findByPk(followingId, { raw: true, attribute: ['id'] }),
        Followship.findOne({ where: { followingId, followerId } })
      ])

      if (!user) newErrorGenerate('無此追蹤對象！', 404)
      if (followship) newErrorGenerate('對象已被使用者追蹤', 400)
      if (Number(followingId) === Number(followerId)) newErrorGenerate('使用者不能追隨自己', 400)

      const newFollowship = await Followship.create({ followingId, followerId })
      return res.json(newFollowship)
    } catch (err) {
      next(err)
    }
  },
  // 移除追蹤
  removeFollowships: async (req, res, next) => {
    try {
      const { followingId } = req.params
      const followerId = helpers.getUser(req).id

      const [user, followship] = await Promise.all([
        User.findByPk(followingId, { raw: true, attribute: ['id'] }),
        Followship.findOne({ where: { followingId, followerId } })
      ])

      if (!user) newErrorGenerate('無此追蹤對象！', 404)
      if (!followship) newErrorGenerate('使用者未追蹤此對象', 400)
      if (Number(followingId) === Number(followerId)) newErrorGenerate('使用者不能對自己進行追蹤相關功能', 400)

      await followship.destroy()
      return res.json(followship)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followController
