const { User, Followship, Sequelize } = require('../models')
const { Op } = require('sequelize')
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: async (req, res, next) => {
    const ownerId = helpers.getUser(req)?.id
    const userId = Number(req.body?.id)
    if (ownerId === userId) return res.status(400).json({ status: 'error', message: 'You can not follow yourself' })
    try {
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: {
            followerId: ownerId,
            followingId: userId
          }
        })
      ])
      if (!user || user.role === 'admin') return res.status(404).json({ status: 'error', message: 'User not found' })
      if (followship) return res.status(400).json({ status: 'error', message: 'You are already following this user!' })
      await Followship.create({
        followerId: ownerId,
        followingId: userId
      })
      const userData = user.toJSON()
      delete userData.password
      delete userData.role
      return res.json({
        status: 'success',
        message: 'Successfully followed the user',
        data: { userData }
      })
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    const ownerId = helpers.getUser(req)?.id
    const userId = Number(req.params?.followingId)
    if (ownerId === userId) return res.status(400).json({ status: 'error', message: 'You can not follow yourself and certainly can not undo' })
    try {
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: {
            followerId: ownerId,
            followingId: userId
          }
        })
      ])
      if (!user || user.role === 'admin') return res.status(404).json({ status: 'error', message: 'User not found' })
      if (!followship) return res.status(400).json({ status: 'error', message: 'You are not followed this user!' })
      await followship.destroy()
      const userData = user.toJSON()
      delete userData.password
      delete userData.role
      return res.json({
        status: 'success',
        message: 'Successfully unfollowed the user',
        data: { userData }
      })
    } catch (err) {
      next(err)
    }
  },
  getMostFollowed: async (req, res, next) => {
    const ownerId = helpers.getUser(req)?.id
    const number = Number(req.params.count)
    try {
      // 先找出已追蹤的使用者
      const followedShips = await Followship.findAll({
        where: { followerId: ownerId },
        attributes: ['followingId'],
        raw: true
      })
      const followedUserIds = followedShips.map(followship => followship.followingId)
      console.log(followedUserIds)
      const users = await User.findAll({
        where: {
          // 排除自己
          id: { [Op.ne]: ownerId },
          // 排除管理員
          role: { [Op.ne]: 'admin' }
        },
        attributes: [
          'id',
          'name',
          'account',
          'avatar',
          'cover',
          [Sequelize.literal('(SELECT COUNT(*) FROM Followships  WHERE Followships.FollowingId = User.id )'), 'follower_count'],
          [Sequelize.literal(`(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = ${ownerId} AND Followships.followingId = Followings.id )`),
            'is_followed']
        ],
        order: [[Sequelize.literal('follower_count'), 'DESC']],
        limit: number,
        nest: true,
        raw: true
      })
      res.status(200).json(users)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followshipController
