const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      // want to follow
      const followingId = req.body.id
      // login user
      const followerId = helpers.getUser(req).id

      if (followingId === followerId) throw new Error('無法追蹤自己！')

      const user = await User.findByPk(followingId)

      if (!user) throw new Error('無法追蹤不存在的使用者！')

      const [isFollowed, created] = await Followship.findOrCreate({
        where: {
          followingId,
          followerId
        },
      })

      if (!created) throw new Error('你已經追蹤該名使用者。')

      res.json({
        status: 'success',
        message: '已成功追蹤該名使用者',
        data: {
          isFollowed
        }
      })
    } catch (err) {
      next(err)
    }
  },
  deleteFollowing: async (req, res, next) => {
    try {
      // want to delete following
      const deleteddFollowingId = req.params.followingId
      // login user
      const followerId = helpers.getUser(req).id

      const user = await User.findByPk(deleteddFollowingId)

      if (!user) throw new Error('無法取消追蹤不存在的使用者！')

      const deletedFollowship = await Followship.destroy({
        where: {
          followingId: deleteddFollowingId,
          followerId
        }
      })


      if (!deletedFollowship) throw new Error('你尚未追蹤該使用者！')

      res.json({
        status: 'success',
        message: '已成功取消追蹤該使用者。',
        data: {
          deleteddFollowingId, // deleted user
          deletedFollowship // delete count 
        }
      })

    } catch (err) {
      next(err)
    }
  }
}

module.exports = followshipController