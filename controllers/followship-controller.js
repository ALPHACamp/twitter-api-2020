const { Followship, User } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req).id
      const followingId = Number(req.body.id)

      const [user, followship] = await Promise.all([
        User.findByPk(followingId),
        Followship.findOne({
          where: {
            followerId: currentUserId,
            followingId
          }
        })
      ])

      // 確認使用者是否存在
      if (!user || user.role === 'admin') {
        return res.status(404).json({
          status: 'error',
          message: 'The user does not exist.'
        })
      }

      // 確認是否已經按過追蹤
      if (followship) throw new Error('You are already following this user!')

      await Followship.create({
        followerId: currentUserId,
        followingId
      })

      res.status(200).json({
        status: 'success'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followshipController
