const { Followship, User } = require('../models')
const helpers = require('../_helpers')

const followController = {
  postFollow: async (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id
      const followingId = req.body.id

      // 確認追蹤對象存在並且為user
      const followingUser = await User.findOne({
        where: {
          id: followingId,
          role: 'user'
        }
      })
      // 確認追蹤者存在並且為user
      const followerUser = await User.findOne({
        where: {
          id: followerId,
          role: 'user'
        }
      })

      // 確認兩者同時存在
      if (!followingUser || !followerUser) throw new Error('資料庫中未找到followingId或followerId')

      // 不能追蹤自己
      if (Number(followerId) === Number(followingId)) throw new Error('無法追蹤自己本人')

      // 確認是否已追蹤
      const followship = await Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })

      if (followship) throw new Error('你已經追蹤該帳號')

      const data = await Followship.create({
        followerId,
        followingId
      })
      return res.status(200).json({ status: 'success', data })
    } catch (err) {
      next(err)
    }
  },
  deleteFollow: async (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id
      const followingId = req.params.followingId

      const followingUser = await User.findOne({
        where: {
          id: followingId,
          role: 'user'
        }
      })

      const followerUser = await User.findOne({
        where: {
          id: followerId,
          role: 'user'
        }
      })

      if (!followingUser || !followerUser) throw new Error('資料庫中未找到followingId或followerId')

      const followship = await Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })

      if (!followship) throw new Error('你尚未追蹤該帳號')

      const data = await followship.destroy()

      return res.status(200).json({ status: 'success', data })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followController
