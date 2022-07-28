const { Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  addFollowship: async (req, res, next) => {
    try {
      const followerId = req.body.id
      const followingId = req.body.id
      const follower = await User.findByPk(followerId, {
        raw: true,
        attributes: { exclude: [ 'password' ] }
      })

      if (followerId === followingId) throw new Error('無法追蹤自己！')
      if (!following || following.role === 'admin') throw new Error('追蹤者不存在！')

      const [followshiped, created] = await Followship.findOrCreate({
        where: { followerId,followingId }
      })
      if (!created) throw new Error('你已經追蹤該名使用者!')

      res.status(200).json({
        message: '已成功追蹤該名使用者。',
        followshiped
      })
    } catch (err) {
      next(err)
    }
  },
  deleteFollowing: async (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id
      const { followingId } = req.params
      const following = await User.findByPk(followingId, {
        raw: true,
        attributes: { exclude: [ 'password' ] }
      })
      const follower = await User.findByPk(followerId, {
        raw: true,
        attributes: { exclude: [ 'password' ] }   
      })
      const deleteFollowship = await Followship.findOne({
        where: { followerId,followingId }
      })

      if (!following || following.role === 'admin') throw new Error("無法取消追蹤不存在的使用者！")
      if (!deleteFollowship) throw new Error("你尚未追蹤該使用者！")
      await deleteFollowship.destroy()
      
      	res.status(200).json({
        message: '已成功取消追蹤該使用者。',
        deleteFollowingUser: user // deleted user
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = followshipController