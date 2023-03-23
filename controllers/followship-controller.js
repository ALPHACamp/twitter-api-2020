const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: async (req, res, next) => {
    const ownerId = helpers.getUser(req)?.id
    const userId = req.body?.id
    console.log(userId)
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
      if (!user) return res.status(404).json({ status: 'error', message: 'User not found' })
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
    const ownerId = helpers.getUser(req).id
    const userId = req.params?.followingId
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
      if (!user) return res.status(404).json({ status: 'error', message: 'User not found' })
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
  }
}

module.exports = followshipController
