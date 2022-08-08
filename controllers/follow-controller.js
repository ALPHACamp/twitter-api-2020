const sequelize = require('sequelize')
const helpers = require('../_helpers')
const { Followship, User } = require('../models')

const followController = {
  addFollow: async (req, res, next) => {
    try {
      const followerId = Number(helpers.getUser(req).id)
      const followingId = Number(req.body.id)
      if (!followerId || !followingId) {
        return res.status(400).json({
          status: 'error',
          message: 'followerId and followingId required'
        })
      }

      if (followerId === followingId) {
        return res.status(401).json({
          status: 'error',
          message: 'Can not follow yourself.'
        })
      }

      const followed = await Followship.findOne({
        where: { followerId, followingId }
      })
      if (followed) {
        return res.status(401).json({
          status: 'error',
          message: 'Already followed'
        })
      }

      await Followship.create({ followerId, followingId })
      return res.status(200).json({
        status: 'success',
        message: 'Followship added'
      })
    } catch (err) {
      next(err)
    }
  },
  removeFollow: async (req, res, next) => {
    try {
      const followerId = Number(helpers.getUser(req).id)
      const followingId = Number(req.params.followingId)
      if (!followerId || !followingId) {
        return res.status(400).json({
          status: 'error',
          message: 'followerId and followingId required'
        })
      }

      const follower = await User.findByPk(followerId)
      const following = await User.findByPk(followingId)
      if (!follower || !following) {
        return res.status(401).json({
          status: 'error',
          message: 'Follower or following not exists.'
        })
      }

      const followship = await Followship.findOne({
        where: { followerId, followingId }
      })
      if (!followship) {
        return res.status(401).json({
          status: 'error',
          message: 'Not followed yet'
        })
      }

      await followship.destroy()
      return res.status(200).json({
        status: 'success',
        message: 'Remove followed success'
      })
    } catch (err) {
      next(err)
    }
  },
  getFollowRank: async (req, res, next) => {
    try {
      // Get query for pagination(optional)
      const limit = Number(req.query.count) || 10
      const offset = (Number(req.query.page) - 1) * limit || null

      // get top 10 users who has most followers
      const rankData = await User.findAll({
        limit,
        offset,
        raw: true,
        where: { role: 'user' },
        order: [[sequelize.literal('followersCount'), 'DESC']],
        attributes: [
          'id', 'name', 'avatar', 'account',
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'
            ),
            'followersCount'
          ]
        ]
      })

      if (!rankData.length) {
        return res.status(200).json([])
      }

      const currentUser = helpers.getUser(req)
      const followingsId = currentUser.Followings.map(f => f.id)
      const rankUsers = rankData.map(rank => ({
        id: rank.id,
        name: rank.name,
        account: rank.account,
        avatar: rank.avatar,
        followerCount: rank.followersCount,
        isFollowed: followingsId.includes(rank.id)
      }))

      return res.status(200).json(rankUsers)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followController
