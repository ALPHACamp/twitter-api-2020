const { User, Followship } = require('../models')

const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const { id } = req.body
      const followingId = Number(id)
      const followerId = req.user.id

      if (followerId === followingId) {
        return res.status(422).json({
          status: 'error',
          message: 'Can not follow yourself'
        })
      }
      const Following = await User.findByPk(followingId)
      if (!Following || Following.role === 'admin'){
        return res.status(422).json({
          status: 'error',
          message: '此用戶不存在'
        })
      }
      
      const followship = await Followship.findOne({
        where: {
          followingId,
          followerId
        }
      })

      if (followship) {
        return res.status(409).json({
          status: 'error',
          message: 'already followed'
        })
      }

      await Followship.create({
        followingId,
        followerId
      })

      return res.status(200).json({
        status: 'success',
        message: 'following successfully'
      })
    } catch (err) {
      next(err)
    }


  },
  removeFollowing: async (req, res, next) => {
    try {

      const followingId = req.params.userId
      const followerId = req.user.id

      if (followerId === Number(followingId)) {
        return res.status(422).json({
          status: 'error',
          message: 'Can not unfollow yourself'
        })
      }
      const followship = await Followship.findOne({
        where: {
          followingId,
          followerId
        }
      })

      if (!followship) {
        return res.status(409).json({
          status: 'error',
          message: 'You are not following'
        })
      }

      await followship.destroy()

      return res.status(200).json({
        status: 'success',
        message: 'unfollowed successfully'
      })
    } catch (err) {
      next(err)
    }


  },
}

module.exports = followshipController