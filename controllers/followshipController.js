'use strict'

const { Followship, User } = require('../models')
const sequelize = require('sequelize')
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id
      const followingId = req.body.id

      const user = await User.findOne({
        where: sequelize.literal(`role != 'admin' AND id = '${followingId}'`)
      })

      const followship = await Followship.findOne({
        where: { followerId, followingId }
      })

      if (followerId === followingId) return res.status(400).json({ status: 'error', message: '你不能追蹤自己' })
      if (!user) return res.status(404).json({ status: 'error', message: '使用者不存在' })
      if (followship) return res.status(400).json({ status: 'error', message: '你已經追蹤此使用者' })

      await Followship.create({ followerId, followingId })
      return res.status(200).json({
        status: 'success',
        message: '成功追蹤使用者'
      })
    } catch (err) {
      return next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id
      const followingId = req.params.followingId
      const user = await User.findByPk(followingId)
      const followship = await Followship.findOne({
        where: { followerId, followingId }
      })

      if (!user) return res.status(404).json({ status: 'error', message: '使用者不存在' })
      if (!followship) return res.status(400).json({ status: 'error', message: '你沒有追蹤此使用者' })

      await followship.destroy()
      return res.status(200).json({
        status: 'success',
        message: '成功取消追蹤此使用者'
      })
    } catch (err) {
      return next(err)
    }
  },
  getTopFollower: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)

      const users = await User.findAll({
        attributes: [
          'id',
          'name',
          'account',
          'avatar',
          'cover',
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'
            ),
            'FollowingCount'
          ],
          [
            sequelize.literal(
              `EXISTS(SELECT followerId FROM Followships WHERE followingId = User.id AND followerId = ${currentUser.id})`
            ),
            'isFollowed'
          ]
        ],
        where: sequelize.literal(`role != 'admin' AND id != '${currentUser.id}'`),
        order: [[sequelize.literal('FollowingCount'), 'DESC']],
        limit: 10,
        raw: true,
        nest: true
      })

      const data = users.map(user => ({
        FollowingId: user.id,
        FollowingName: user.name,
        FollowingAccount: user.account,
        FollowingAvatar: user.avatar,
        FollowingCover: user.cover,
        FollowingCount: user.FollowingCount,
        isFollowed: Boolean(user.isFollowed)
      }))

      return res.status(200).json(data)
    } catch (err) {
      return next(err)
    }
  }
}
module.exports = followshipController
