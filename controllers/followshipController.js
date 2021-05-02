const db = require('../models')
const Followship = db.Followship
const helpers = require('../_helpers')
const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const followerId = helpers.getUser(req).id
      const followingId = req.body.id

      if (!followerId || !followingId) {
        return res.json({ status: 'error', message: "Can't find followerId." })
      }
      await Followship.create({
        followerId, followingId
      })
      return (res.json({ status: 'success', message: 'Followship has built successfully!' }), next())

    } catch (e) {
      console.log(e)
      return next(e)
    }

  },

  removeFollowing: async (req, res, next) => {
    try {
      let followship = await Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.params.userId
        }
      })
      if (followship === null) {
        return res.json({ status: 'error', message: "Can't find followships." })
      }
      followship.destroy()
      return res.json({ status: 'success', message: 'Followship has removed successfully!' })
    } catch (e) {
      console.log(e)
      return next(e)
    }
  }
}

module.exports = followshipController