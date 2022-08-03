const { Followship, User, Tweet } = require('../models')
const helpers = require('../_helpers')

const followController = {
  addFollow: async (req, res, next) => {
    try {
      const followingId = req.body.id
      const followerId = helpers.getUser(req).id

      if (!followingId) res.status(404).json({ status: 'error', message: '找不到 followingId!' })
      if (!followerId) res.status(404).json({ status: 'error', message: '找不到 followerId!' })

      const following = await User.findByPk(followingId)
      const follower = await User.findByPk(followerId)

      if (followerId === followingId) {
        return res.status(400).json({
          status: 'error',
          message: '使用者不能追蹤自己!'
        })
      }

      if (!follower || !following) {
        return res.status(404).json({
          status: 'error',
          message: '找不到使用者!'
        })
      }

      const followship = await Followship.findOne({
        where: { followerId, followingId }
      })

      if (followship) {
        return res.status(400).json({
          status: 'error',
          message: '使用者已追蹤!'
        })
      }

      await Followship.create({
        followerId,
        followingId
      })

      return res.status(200).json({
        status: 'success',
        message: '成功追蹤!'
      })
    } catch (err) {
      next(err)
    }
  },
  removeFollow: async (req, res, next) => {
    try {
      const followingId = Number(req.params.followingId)
      const followerId = Number(helpers.getUser(req).id)
      const follower = await User.findByPk(followerId)
      const following = await User.findByPk(followingId)

      if (!follower || !following) {
        return res.status(404).json({
          status: 'error',
          message: '找不到使用者!'
        })
      }

      const followship = await Followship.findOne({
        where: { followerId, followingId }
      })

      if (!followship) {
        return res.status(400).json({
          status: 'error',
          message: '使用者未追蹤!'
        })
      }

      await followship.destroy()

      return res.status(200).json({
        status: 'success',
        message: '成功取消追蹤!'
      })
    } catch (err) {
      next(err)
    }
  },
  getFollowersTweets: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id

      const followers = await Followship.findAll({
        where: { followerId: currentUserId },
        attributes: ['followingId'],
        raw: true
      })

      const userIdArray = [currentUserId]
      followers.forEach(follower => {
        userIdArray.push(follower.followingId)
      })

      const data = await Tweet.findAll({
        where: { UserId: userIdArray },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'avatar', 'name']
          }
        ],
        raw: true
      })

      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followController
