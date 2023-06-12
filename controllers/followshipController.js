const helpers = require('../_helpers')
const { User, Followship, sequelize } = require('../models')

const followshipController = {
  addFollowing: async (req, res, next) => {
    try {
      // get the current user
      const user = helpers.getUser(req)
      // request the ID of the user to be followed
      const followingId = req.body.id

      // user cannot follow themselves
      if (user.id === followingId) {
        return res.status(400).json({ error: 'You cannot follow yourself!' })
      }

      // check if a followship already exists
      const follow = await Followship.findOne({
        where: { followerId: user.id, followingId: followingId }
      })
      // if a followship exists
      if (follow) {
        return res.status(400).json({ error: 'You have followed this user!' })
      }
      console.log(follow)

      // if no followship exists
      await Followship.create({
        followerId: user.id,
        followingId: followingId
      })
      return res.status(200).json({
        status: 'success'
      })
    } catch (err) {
      next(err)
    }
  },

  removeFollowing: async (req, res, next) => {
    try {
      // get the current user
      const user = helpers.getUser(req)
      // get the following id
      const { followingId } = req.params

      // check if a followship already exists
      const follow = await Followship.findOne({
        where: { followerId: user.id, followingId: followingId }
      })
      // if a followship exists
      if (!follow) {
        return res
          .status(400)
          .json({ error: "You haven't followed this user!" })
      }
      // delete the following
      await follow.destroy()

      return res.status(200).json({
        status: 'success'
      })
    } catch (err) {
      next(err)
    }
  },
  getTopFollowing: async (req, res, next) => {
    try {
      // get the current user
      const currentUser = helpers.getUser(req)
      // change
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
        where: sequelize.literal(`account != 'root' AND account != '${currentUser.account}'`),
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
