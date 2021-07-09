const db = require('../models')
const { Followship, User } = db

const followController = {
  addFollowing: async (req, res) => {
    try {
      const followerId = req.user.id
      const followingId = req.body.id

      // check this followingId's role should be user.
      const followingUser = await User.findOne({
        where: {
          id: followingId,
          role: 'user'
        }
      })
      // check this followerId's role should be user.
      const followerUser = await User.findOne({
        where: {
          id: followerId,
          role: 'user'
        }
      })

      // check both followerId and followingId are existed.
      if (!followingUser | !followerUser) {
        return res.status(404).json({ status: 'error', message: 'Cannot find this followingId or followerId.' })
      }

      // cannot follow self.
      if (followerId === Number(followingId)) {
        return res.status(403).json({ status: 'error', message: 'You cannot follow yourself.' })
      }

      // check followship
      const followship = await Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })

      if (followship) {
        return res.status(409).json({ status: 'error', message: `You already followed @${followingUser.account}` })
      }

      await Followship.create({
        followerId,
        followingId
      })
      return res.status(200).json({ status: 'success', message: `You followed @${followingUser.account} successfully.` })
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  },
  removeFollowing: async (req, res) => {
    try {
      const followerId = req.user.id
      const followingId = req.params.followingId

      const unfollowingUser = await User.findOne({
        where: {
          id: followingId,
          role: 'user'
        }
      })
      // check this followerId's role should be user.
      const unfollowerUser = await User.findOne({
        where: {
          id: followerId,
          role: 'user'
        }
      })

      if (!unfollowingUser | !unfollowerUser) {
        return res.status(404).json({ status: 'error', message: 'Cannot find this followingId or followerId.' })
      }

      if (followerId === Number(followingId)) {
        return res.status(403).json({ status: 'error', message: 'You cannot unfollow yourself.' })
      }

      const followship = await Followship.findOne({
        where: {
          followerId,
          followingId
        }
      })

      if (!followship) {
        return res.status(409).json({ status: 'error', message: `You didn't followed @${unfollowingUser.account} before.` })
      }

      await followship.destroy()

      return res.status(200).json({ status: 'success', message: `Unfollowed @${unfollowingUser.account} successfully.` })
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 'error', message: 'error' })
    }
  }
}

module.exports = followController
