const { getUser } = require('../../_helpers')
const { Followship } = require('../../models')

const followshipController = {
  // 更改路由新增:followshipId?
  postFollowship: async (req, res, next) => {
    try {
      let { id } = req.body
      id = Number(id)
      // 確認使用者是否已經追蹤該用戶
      const followship = await Followship.findOne({ where: { followingId: id, followerId: getUser(req).id } })
      // 如果有 => 不用新增
      if (followship) {
        const error = new Error('You have followed this user.')
        error.status = 409
        throw error
      }

      const newFollow = await Followship.create({
        followerId: getUser(req).id,
        followingId: id
      })
      return res.status(200).json(newFollow.toJSON())
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
      if (!follow) {
        const error = new Error("You have'nt followed this user.")
        error.status = 404
        throw error
      }
      const deleteFollow = await follow.destroy()
      return res.status(200).json(deleteFollow.toJSON())
    } catch (error) {
      next(error)
    }
  }
}

module.exports = followshipController
