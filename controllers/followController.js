const db = require('../models')
const { Followship, User } = db

const followController = {
  addFollowing: async (req, res) => {
    try {
      const followerId = req.user.id
      const followingId = req.params.id

      // check this followingId's role should be user.
      const followedUser = await User.findOne({
        where: {
          id: followingId,
          role: 'user'
        }
      })

      // check both followerId and followingId are existed.
      if (!followedUser | !followerId) {
        return res.status(404).json({ status: 'error', message: 'Cannot find this followingId or followerId.' })
      }

      // cannot follow self.
      if (followerId === Number(followingId)) {
        return res.status(403).json({ status: 'error', message: 'You cannot follow yourself' })
      }

      // check followship
      const followship = await Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })

      if (followship) {
        return res.status(409).json({ status: 'error', message: `You already followed @${followedUser.account}` })
      }

      await Followship.create({
        followerId,
        followingId
      })
      return res.status(201).json({ status: 'success', message: `followed @${followedUser.account}successfully.` })
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  }

}

module.exports = followController
