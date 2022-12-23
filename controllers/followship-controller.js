const { User, Followship, sequelize } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const followingId = Number(req.body.id)
      if (currentUser.id === followingId) throw new Error('不能追蹤自己!')
      const [user, followship] = await Promise.all([
        User.findByPk(followingId),
        Followship.findOne({
          where: {
            followerId: currentUser.id,
            followingId
          }
        })
      ])
      if (!user) throw new Error('使用者不存在!')
      if (followship) throw new Error('你已經追蹤此使用者了!')
      const newFollowship = await Followship.create({
        followerId: currentUser.id,
        followingId
      })
      const newFollowshipData = newFollowship.toJSON()
      res.status(200).json(newFollowshipData)
    } catch (error) {
      next(error)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const followingId = Number(req.params.followingId)
      const followship = await Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: followingId
        }
      })
      if (!followship) throw new Error('你還沒追蹤此使用者!')
      const deleteFollowship = await followship.destroy()
      const deleteFollowshipData = deleteFollowship.toJSON()
      res.status(200).json(deleteFollowshipData)
    } catch (error) {
      next(error)
    }
  },
  getTopUsers: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const users = await User.findAll({
        attributes: [
          'id', 'account', 'name', 'avatar',
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id )'), 'followerCount'],
          [sequelize.literal(`EXISTS (SELECT id FROM Followships WHERE Followships.followerId = ${currentUser.id} AND Followships.followingId = User.id )`), 'isFollowed']
        ],
        order: [
          [sequelize.literal('followerCount'), 'DESC'], ['createdAt', 'DESC']
        ],
        raw: true
      })
      const topUsersData = users.slice(0, 10)
      res.status(200).json(topUsersData)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = followshipController
