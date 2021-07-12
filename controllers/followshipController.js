const { User, Followship } = require('../models')

const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      if (req.user.id === req.body.id) {
        return res.json({ status: 'error', message: '無法追隨自己！' })
      }
      const followship = await Followship.findOne({
        where: { followerId: req.user.id, followingId: req.body.id }
      })
      if (followship) {
        return res.json({ status: 'error', message: '已追隨這個使用者！' })
      }
      // 未追隨使用者，create 並將使用者/被追隨者 FollowingCounts/FollowerCounts + 1
      await Followship.create({
        followerId: req.user.id,
        followingId: req.body.id
      })
      await User.increment('followingCounts', { where: { id: req.user.id } })
      await User.increment('followerCounts', { where: { id: req.body.id } })
      return res.json({ status: 'success', message: '新增追隨成功！' })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  removeFollowing: async (req, res, next) => {
    try {
      const followship = await Followship.findOne({
        where: {
          followingId: req.params.followingId,
          followerId: req.user.id
        }
      })
      if (!followship) {
        return res.json({ status: 'error', message: '未追隨此使用者！' })
      }
      // Followship 存在，destroy 並將使用者/被追隨者 FollowingCounts/FollowerCounts - 1
      await followship.destroy()
      await User.decrement('followingCounts', { where: { id: req.user.id } })
      await User.decrement('followerCounts', { where: { id: req.params.followingId } })
      return res.json({ status: 'success', message: '已取消追隨' })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = followshipController