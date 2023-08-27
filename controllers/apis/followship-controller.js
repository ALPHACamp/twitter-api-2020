const db = require('../../models')
const { User, Followship } = db
const helpers = require('../../_helpers')
const sequelize = require('sequelize')

const followshipController = {
  followUser: async (req, res, next) => {
    try {
      const followingId = req.body.id
      const getUser = helpers.getUser(req)
      const userId = getUser.id
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: { followerId: userId, followingId }
        })
      ])
      if (!user) throw new Error("User didn't exist!")
      if (followship) throw new Error("You've are already followed this user!")
      Followship.create({
        followerId: userId,
        followingId
      })
      res.status(200).json({
        status: 'success',
        message: 'successfully follow user!'
      })
    } catch (err) {
      next(err)
    }
  },
  unfollowUser: async (req, res, next) => {
    try {
      const followingId = req.params.following_id
      const getUser = helpers.getUser(req)
      const userId = getUser.id
      const [user, followship] = await Promise.all([
        User.findByPk(userId),
        Followship.findOne({
          where: { followerId: userId, followingId }
        })
      ])
      if (!user) throw new Error("User didn't exist!")
      if (!followship) throw new Error("You haven't followed this user!")
      Followship.destroy({
        where: { followerId: userId, followingId }
      })
      res.status(200).json({
        status: 'success',
        message: 'successfully unfollow user!'
      })
    } catch (err) {
      next(err)
    }
  },
  getTop10: async (req, res, next) => {
    try {
      const getUser = helpers.getUser(req)
      const currentUserId = getUser.id
      if (!currentUserId) throw new Error("User didn't exist!")

      const top10UsersWithFollowStatus = await User.findAll({
        where: {
          role: 'user',
          id: { [sequelize.Op.not]: currentUserId }
        },
        attributes: [
          'id',
          'account',
          'name',
          'avatar',
          [
            sequelize.literal(
              '(SELECT COUNT(DISTINCT id) FROM Followships WHERE following_id = User.id)'
            ),
            'totalFollowers'
          ],
          [
            sequelize.literal(
              `EXISTS (SELECT 1 FROM Followships WHERE following_id = User.id AND follower_Id = ${currentUserId})`
            ),
            'isFollowed'
          ]
        ],
        include: [
          {
            model: User,
            as: 'Followers',
            attributes: [],
            through: { attributes: [] }
          }
        ],
        order: [[sequelize.literal('totalFollowers'), 'DESC']],
        limit: 10,
        subQuery: false, // 避免因查詢多張表造成limit失常
        raw: true,
        nest: true
      })

      res.status(200).json({
        top10UsersWithFollowStatus
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = followshipController
