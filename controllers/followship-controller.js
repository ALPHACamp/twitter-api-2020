const { Followship, User } = require('../models')
const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (!user) {
        return res
          .status(404)
          .json({
            status: 'error',
            message: '您要追蹤的使用者不存在'
          })
      }
      if (req.user.id == req.params.id) {
        return res
          .status(400)
          .json({
            status: 'error',
            message: '不可追蹤自己'
          })
      }
      const followingUser = await Followship.findOne({
        where: {
          followingId: req.params.id,
        }
      })
      if (followingUser) {
        return res
          .status(400)
          .json({
            status: 'error',
            message: '您已追蹤過此使用者'
          })
      }
      const followship = await Followship.create({
        followerId: req.user.id,
        followingId: req.params.id
      })
      if (followship) {
        return res.status(200).json({
        status: 'success',
        message: '成功追蹤此使用者!'
      })
    }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error
      })
    }
  }
}
module.exports = followshipController
