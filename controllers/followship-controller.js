const helpers = require('../_helpers')
const { Followship } = require('../models')

const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const followingId = req.body.id
      if (currentUserId === Number(followingId)) {
        return res.status(404).json({
          status: '404',
          message: 'You can not follow yourself!'
        })
      }
      const ifFollowed = await Followship.findOne({
        where: {
          followerId: currentUserId,
          followingId
        }
      })
      if (ifFollowed) {
        return res.status(404).json({
          status: '404',
          message: 'You have already followed this user!'
        })
      }
      const followRecord = await Followship.create({
        followerId: currentUserId,
        followingId
      })
      res.status(200).json({ "status": 200, "data": followRecord })
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const followingId = req.params.followingId
      const ifFollowed = await Followship.findOne({
        where: {
          followerId: currentUserId,
          followingId
        }
      })
      if (!ifFollowed) {
        return res.status(404).json({
          status: '404',
          message: 'You have not followed this user!'
        })
      }
      await ifFollowed.destroy()
      res.status(200).json({ "status": 200, "data": ifFollowed })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followshipController