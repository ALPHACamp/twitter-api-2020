const { getUser } = require('../../_helpers')
const { Followship } = require('../../models')

const followshipController = {
  postFollowship: async (req, res, next) => {
    try {
      const { id } = req.body
      // 確認使用者是否已經追蹤該用戶
      const followship = await Followship.findOne({ where: { followingId: id, followerId: getUser(req).id } })
      // 如果有 => 不用新增
      if (followship) throw new Error('You have followed this user.')

      const newFollow = await Followship.create({
        followerId: getUser(req).id,
        followingId: id
      })
      return res.json({ status: 'success', data: newFollow })
    } catch (error) {
      next(error)
    }
  },
  deleteFollowship: async (req, res, next) => {
    try {
      const { followingId } = req.params
      // 確認使用者是否已經追蹤該用戶
      const follow = await Followship.findOne({
        where: { followerId: getUser(req).id, followingId }
      })
      // 如果沒有 => 不用刪除
      if (!follow) throw new Error('You have not followed this user.')

      const deleteFollow = await follow.destroy()
      return res.json({ status: 'success', data: deleteFollow.toJSON() })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = followshipController
