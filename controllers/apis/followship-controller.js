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
      const user = await User.findByPk(userId)
      if (!user) throw new Error("User didn't exist!")
      const followship = await Followship.findOrCreate({
        raw: true,
        nest: true,
        where: {
          followerId: userId,
          followingId
        }
      })

      if (!followship[1]) {
        throw new Error("You've are already followed this user!")
      }
      console.log(followship)
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
      const user = await User.findByPk(userId)
      if (!user) throw new Error("User didn't exist!")
      const followship = await Followship.destroy({
        where: {
          followerId: userId,
          followingId
        }
      })

      if (!followship[1]) {
        throw new Error("You've are already followed this user!")
      }
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

      const top10 = await User.findAll({
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
              `(CASE WHEN EXISTS (SELECT 1 FROM Followships WHERE following_id = User.id AND follower_Id = ${currentUserId}) THEN TRUE ELSE FALSE END)`
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

      const top10UsersWithFollowStatus = []
      top10.forEach(item => {
        top10UsersWithFollowStatus.push({
          ...item,
          isFollowed: item.isFollowed === 1
        })
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
