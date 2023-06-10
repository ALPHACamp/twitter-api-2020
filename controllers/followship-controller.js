const { Followship, User } = require('../models')

const followController = {
  postFollow: async (req, res, next) => {
    try {
      const followerId = req.user.id
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
      if (!followingUser || !followerUser) {
        return res.status(404).json({ status: 'error', message: "Can't' find this followingId or followerId." })
      }

      // 不能追蹤自己
      if (Number(followerId) === Number(followingId)) {
        return res.status(403).json({ status: 'error', message: "You can't' follow yourself." })
      }

      // 確認是否已追蹤
      const followship = await Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })

      if (followship) {
        return res.status(409).json({ status: 'error', message: `You have followed @${followingUser.account}` })
      }

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
      const followerId = req.user.id
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

      if (!followingUser || !followerUser) {
        return res.status(404).json({ status: 'error', message: "Can't' find this followingId or followerId." })
      }

      const followship = await Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })

      if (!followship) {
        return res.status(409).json({ status: 'error', message: `You didn't followed @${followingUser.account}.` })
      }

      const data = await followship.destroy()

      return res.status(200).json({ status: 'success', data })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followController
