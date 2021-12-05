const { Use, Followship } = require('../models')
const helpers = require('../_helpers')

const followController = {
  getTopUser: async (req, res) => {
    try {
      const limit = Number(req.body.limit)

      const users = await User.findAll({
        include: [{ model: User, as: 'Followers' }],
      })

      let result = users.map((user) => ({
        id: user.dataValues.id,
        avatar: user.dataValues.avatar,
        account: user.dataValues.account,
        name: user.dataValues.name,
        followerCounts: user.dataValues.Followers.length,
        isFollowing: helpers.getUser(req).Followings.some(following => following.id === user.dataValues.id)
      }))

      result = result.sort((a, z) => z.followerCounts - a.followerCounts)
      res.status(200).json({ status: 'success', results: result.slice(0, limit) })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: 'Server error' })
    }
  },

  addFollowing: async (req, res) => {
    try {
      await Followship.create({ followerId: helpers.getUser(req).id, followingId: Number(req.body.id) })
      return res.status(200).json({ status: 'success', message: '成功送出請求' })
    } catch (error) {
      console.log(error)
      return res
        .status(500)
        .json({ status: 'error', message: 'service error!' })
    }
  }
}

module.exports = followController
