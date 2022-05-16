const { Followship, User } = require('../../models')
const helpers = require('../../_helpers')

const followshipController = {
  postFollowship: async (req, res, next) => {
    try {
      const { id } = Number(req.body)

      const meUserId = helpers.getUser(req)?.id
      if (meUserId === id) throw new Error('you can not follow yourself')

      const user = await User.findByPk(id)
      if (!user) throw new Error('User does not exist!!')

      const isFollowing = await Followship.findOne({ where: { followerId: meUserId, followingId: id } })
      if (isFollowing) throw new Error('Follow record already exists!!')

      const data = await Followship.create({ followerId: meUserId, followingId: id })

      return res.json({
        status: 'success',
        data
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followshipController
