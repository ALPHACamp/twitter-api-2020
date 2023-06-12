const helpers = require('../_helpers')
const { User, Followship, sequelize } = require('../models')
const { Op } = require('sequelize')

const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      // get the current user
      const user = helpers.getUser(req)
      const followerId = user.id
      const followingId = req.body.id

      // following use cannoot be admin
      const followingUser = await User.findOne({
        where: {
          id: followingId,
          role: {
            [Op.ne]: 'admin'
          }
        }
      })
      // check the user exist
      if (!followingUser) {
        return res.status(400).json({
          status: 'error',
          message: "This user doesn't exist"
        })
      }

      // user cannot follow themselves
      if (user.id === followingId) {
        return res
          .status(400)
          .json({ status: 'error', message: 'You cannot follow yourself!' })
      }

      // check if a followship already exists
      const follow = await Followship.findOne({
        where: { followerId: user.id, followingId: followingId }
      })
      // if a followship exists
      if (follow) {
        return res.status(400).json({status: 'error', message: 'You have followed this user!' })
      }

      // if no followship exists
      await Followship.create({
        followerId,
        followingId
      })
      return res.status(200).json({
        status: 'success',
        message: 'Followed'
      })
    } catch (err) {
      next(err)
    }
  },

  removeFollowing: async (req, res, next) => {
    try {
      // get the current user
      const user = helpers.getUser(req)
      const followerId = user.id
      const followingId = req.params.followingId;

      // following use cannoot be admin
      const unfollowingUser = await User.findOne({
        where: {
          id: followingId,
          role: {
            [Op.ne]: 'admin'
          }
        }
      })
      // check the user exist
      if (!unfollowingUser) {
        return res.status(400).json({
          status: 'error',
          message: "This user doesn't exist"
        })
      }

      // user cannot follow themselves
      if (user.id === followingId) {
        return res
          .status(400)
          .json({ status: 'error', message: 'You cannot unfollow yourself!' })
      }

      // check if a followship already exists
      const follow = await Followship.findOne({
        where: {
          followingId,
          followerId
        }
      })
      // if a followship exists
      if (!follow) {
        return res
          .status(400)
          .json({ status: 'error', message: "You haven't followed this user before" })
      }
      // delete the following
      await follow.destroy()

      return res.status(200).json({
        status: 'success',
        message: 'Unfollowed'
      })
    } catch (err) {
      next(err)
    }
  },
  getTopFollowing: async (req, res, next) => {
    try {
      // get the current user
      const currentUser = helpers.getUser(req)

      // get the top 10 most followed users
      const users = await User.findAll({
        attributes: [
          'id',
          'name',
          'account',
          'avatar',
          'cover',
          [
            sequelize.literal(
              '(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)'
            ),
            'FollowingCount'
          ]
        ],
        where: sequelize.literal(`role != 'admin' AND id != '${currentUser.id}'`),
        order: [[sequelize.literal('FollowingCount'), 'DESC'], ['createdAt']],
        limit: 10,
        raw: true,
        nest: true
      })

      const data = await Promise.all(
        users.map(async user => {
          const isFollowed = await Followship.findOne({
            where: {
              followingId: user.id,
              followerId: currentUser.id
            }
          })

          return {
            FollowingId: user.id,
            FollowingName: user.name,
            FollowingAccount: user.account,
            FollowingAvatar: user.avatar,
            FollowingCount: user.FollowingCount,
            isFollowed: !!isFollowed
          }
        })
      )
      return res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = followshipController
