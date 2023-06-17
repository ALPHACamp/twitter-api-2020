const { getUser } = require('../../_helpers')
const { Followship, User } = require('../../models')

const followshipController = {
  // 更改路由新增:followshipId?
  postFollowship: async (req, res, next) => {
    try {
      let { id } = req.body
      id = Number(id)

      // 使用者無法追蹤自己
      if (id === getUser(req).id) {
        const error = "You can't follow yourself"
        error.status = 400
      }
      // 使用者無法追蹤admin
      const admin = await User.findByPk(id)
      if (admin.role === 'admin') {
        const error = new Error("The user doesn't exist")
        error.status = 404
        throw error
      }

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

      // 使用者無法取消追蹤自己
      if (Number(followingId) === getUser(req).id) {
        const error = "You can't follow yourself"
        error.status = 400
      }

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
