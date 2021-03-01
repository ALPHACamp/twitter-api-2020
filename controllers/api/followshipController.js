const db = require('../../models')

const { Followship, User } = db

// @todo - add error handling

const followshipController = {
  follow: async (req, res) => {
    const { id } = req.body
    const userId = req.user ? req.user.id : 1 // 1 is for testing only
    // check if user id exist or doesn't have id in req.body
    const user = await User.findByPk(id)
    if (!user) {
      return res.status(400).json({ status: 'error', message: 'user doesn\'t exist or id is not provided' })
    }
    // check if already followed
    const follow = await Followship.findOne({
      where: { followerId: userId, followingId: id }
    })
    if (follow) {
      return res.status(400).json({ status: 'error', message: 'user already followed by this user' })
    }

    await Followship.create({
      followerId: userId,
      followingId: id
    })
    return res.json({ status: 'success', message: 'Success' })
  },
  unfollow: async (req, res) => {
    const { followingId } = req.params
    const userId = req.user ? req.user.id : 1 // 1 is for testing only
    const follow = await Followship.findOne({
      where: { followerId: userId, followingId }
    })
    console.log(followingId)
    console.log(follow)
    if (!follow) {
      return res.status(400).json({ status: 'error', message: 'no followed record or no user id found' })
    }
    await follow.destroy()
    return res.json({ status: 'success', message: 'Success' })
  }
}

module.exports = followshipController
