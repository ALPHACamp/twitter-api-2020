const helpers = require('../_helpers')
const { Followship } = require('../models')

const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const followingId = req.body.id
      if (currentUserId === Number(followingId)) {
        return res.status(406).json({
          status: '406',
          message: 'You can not follow yourself!'
        })
      }
      const isFollowed = await Followship.findOne({
        where: {
          followerId: currentUserId,
          followingId
        }
      })
      if (isFollowed) {
        return res.status(404).json({
          status: '404',
          message: 'You have already followed this user!'
        })
      }
      const followRecord = await Followship.create({
        followerId: currentUserId,
        followingId
      })
      res.status(200).json(followRecord)
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const followingId = req.params.followingId
      const isFollowed = await Followship.findOne({
        where: {
          followerId: currentUserId,
          followingId
        }
      })
      if (!isFollowed) {
        return res.status(404).json({
          status: '404',
          message: 'You have not followed this user!'
        })
      }
      await isFollowed.destroy()
      res.status(200).json(isFollowed)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followshipController