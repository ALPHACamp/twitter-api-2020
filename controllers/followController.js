const { Followship } = require('../models')
const { User } = require('../models')
const helpers = require('../_helpers')

const followController = {
  getTopUser: async (req, res) => {
    try {
      const limit = Number(req.body.limit)

      const users = await User.findAll({
        include: [{ model: User, as: 'Followers' }],
        limit: limit
      })

      let result = users.map((user) => ({
        id: user.dataValues.id,
        avatar: user.dataValues.avatar,
        account: user.dataValues.account,
        name: user.dataValues.name,
        followersCount: user.dataValues.Followers.length,
        isFollowing: helpers.getUser(req).Followings.some(following => following.id === user.dataValues.id)
      }))

      result = result.sort((a, z) => z.followersCount - a.followersCount)
      res.status(200).json(result)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: 'error', message: 'Server error' })
    }
  }
}

module.exports = followController
