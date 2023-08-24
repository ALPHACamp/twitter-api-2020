'use strict'

const { Followship, User } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id
      const followingId = req.body.id
      const user = await User.findByPk(followingId)
      const followship = await Followship.findOne({
        where: { followerId, followingId }
      })

      if (followerId === followingId) return res.status(400).json({ status: 'error', message: '你不能追蹤自己' })
      if (followship) return res.status(400).json({ status: 'error', message: '你已經追蹤此使用者' })
      if (!user) return res.status(404).json({ status: 'error', message: '使用者不存在' })

      await Followship.create({ followerId, followingId })
      return res.status(200).json({
        status: 'success',
        message: '成功追蹤使用者'
      })
    } catch (err) {
      next(err)
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

      if (followerId === followingId) return res.status(400).json({ status: 'error', message: '你不能取消追蹤自己' })
      if (!followship) return res.status(400).json({ status: 'error', message: '你沒有追蹤此使用者' })
      if (!user) return res.status(404).json({ status: 'error', message: '使用者不存在' })

      await followship.destroy()
      return res.status(200).json({
        status: 'success',
        message: '成功取消追蹤此使用者'
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = followshipController
