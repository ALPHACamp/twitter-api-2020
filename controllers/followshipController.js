const db = require('../models')
const Followship = db.Followship
const User = db.User
const helpers = require('../_helpers')

const followshipController = {
  followUser: async (req, res) => {
    try {
      const followingId = req.body.id
      const followingUser = await User.findByPk(followingId)
      const followerId = helpers.getUser(req).id

      if (Number(followingId) !== followerId) {
        await Followship.create({
          followerId,
          followingId,   // 前端要埋在 form 裡傳過來
          createdAt: new Date(),
          updatedAt: new Date()
        })
        return res.json({ status: 'success', message: `followed @${followingUser.account}`, followingUser })
      }

      return res.json({ status: 'error', message: 'You cannot follow yourself.' })
    }

    catch (error) {
      console.log(error)
    }

  },

  unfollowUser: (req, res) => {

  }
}

module.exports = followshipController
