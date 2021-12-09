const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followController = {
  getTopUser: async (req, res) => {
    try {
      const limit = 10

      const users = await User.findAll({
        include: [{ model: User, as: 'Followers' }],
        where: { role: 'user' }
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
      // user cannot follow themselves
      if (helpers.getUser(req).id === Number(req.body.id)) {
        return res.status(400).json({ status: 'error', message: '不可以追蹤自己' })
      }
      await Followship.create({ followerId: helpers.getUser(req).id, followingId: Number(req.body.id) })
      return res.status(200).json({ status: 'success', message: '成功新增追蹤者' })
    } catch (error) {
      console.log(error)
      return res
        .status(500)
        .json({ status: 'error', message: 'service error!' })
    }
  },

  deleteFollowing: async (req, res) => {
    try {
      await Followship.destroy({ where: { followerId: Number(helpers.getUser(req).id), followingId: Number(req.params.followingId) } })
      return res.status(200).json({ status: 'success', message: '成功退追蹤' })
    } catch (error) {
      console.log(error)
      return res
        .status(500)
        .json({ status: 'error', message: 'service error!' })
    }
  }

}

module.exports = followController
