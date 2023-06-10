const helpers = require('../_helpers')
const { Followship } = require('../models')

const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      // get the current user
      const user = helpers.getUser(req)
      // request the ID of the user to be followed
      const followingId = req.body.id

      // check if a followship already exists
      const follow = await Followship.findOne({
        where: { followerId: user.id, followingId: followingId }
      })
      // if a followship exists
      if (follow) {
        return res.status(400).json({ error: 'You have followed this user!' })
      }
      console.log(follow)

      // if no followship exists
      await Followship.create({
        followerId: user.id,
        followingId: followingId
      })
      return res.status(200).json({
        status: 'success'
      })
    } catch (err) {
      next(err)
    }
  },

  removeFollowing: async (req, res, next) => {
    try {
      // get the current user
      const user = helpers.getUser(req)
      // get the following id
      const { followingId } = req.params

      // check if a followship already exists
      const follow = await Followship.findOne({
        where: { followerId: user.id, followingId: followingId }
      })
      // if a followship exists
      if (!follow) {
        return res
          .status(400)
          .json({ error: "You haven't followed this user!" })
      }
      // delete the following
      await follow.destroy()

      return res.status(200).json({
        status: 'success'
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = followshipController
