const db = require('../models')
const Followship = db.Followship
const helpers = require('../_helpers')
const followshipController = {
  addFollowing: async (req, res) => {
    try {
      if (!helpers.getUser(req).id) {
        return res.json({ status: 'error', message: "Can't find followerId." })
      }
      await Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: req.params.userId
      })
      return res.json({ status: 'success', message: 'Followship has built successfully!' })

    } catch (e) { console.log(e) }

  },

  removeFollowing: async (req, res) => {
    try {
      if (!helpers.getUser(req).id) {
        return res.json({ status: 'error', message: "Can't find followerId." })
      }
      let followship = await Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.params.userId
        }
      })
      followship.destroy()
      return res.json({ status: 'success', message: 'Followship has removed successfully!' })
    } catch (e) { console.log(e) }
  }
}

module.exports = followshipController