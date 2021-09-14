const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Followship = db.Followship

const followshipController = {
  addFollowing: async (req, res) => {
    try {
      await Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: req.body.id
      })
      const follower = await User.findByPk(helpers.getUser(req).id)
      await follower.increment(['followingCount'], { by: 1 })
      const following = await User.findByPk(req.body.id)
      await following.increment(['followerCount'], { by: 1 })
      const data = { status: 'success', message: 'the user was successfully followed' }
      return res.json(data)
    } catch (err) {
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  },
  removeFollowing: async (req, res) => {
    try {
      const followship = await Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.params.followingId
        }
      })
      followship.destroy()
      const follower = await User.findByPk(helpers.getUser(req).id)
      await follower.decrement(['followingCount'], { by: 1 })
      const following = await User.findByPk(req.params.followingId)
      await following.decrement(['followerCount'], { by: 1 })
      const data = { status: 'success', message: 'the user was successfully unfollowed' }
      return res.json(data)
    } catch (err) {
      const data = { status: 'error', message: err }
      return res.json(data)
    }
  }
}

module.exports = followshipController
