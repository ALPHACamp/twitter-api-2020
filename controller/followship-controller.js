const { Followship, User } = require('../models')
const helpers = require('../_helpers')
const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id
      const followingId = Number(req.body.id)
      if (followingId === followerId) throw new Error('禁止追蹤自己!')
      const user = await User.findByPk(followingId)
      if (!user) throw new Error('User not exist!')
      const isFollowed = await Followship.findOne({ where: { followingId, followerId } })
      if (isFollowed) throw new Error('您已經關注對方了!')
      await Followship.create({
        followerId,
        followingId
      })
      return res.status(200).json({ message: '您已經成功關注對方!' })
    } catch (err) { next(err) }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id
      const followingId = Number(req.params.followingId)
      const user = await User.findByPk(followingId)
      if (!user) throw new Error('User not exist!')
      const isFollowed = await Followship.findOne({ where: { followingId, followerId } })
      if (!isFollowed) throw new Error('您尚未關注對方!')
      await isFollowed.destroy()
      return res.status(200).json({ message: '您已經取消關注對方!' })
    } catch (err) { next(err) }
  }
}

module.exports = followshipController
