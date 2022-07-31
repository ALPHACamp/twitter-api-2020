const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  getTopUsers: async (req, res, next) => {
    try {
      const theSignInUser = helpers.getUser(req).toJSON()
      const users = await User.findAll({
        include: [{ model: User, as: 'Followers' }],
      })

      const topUsersApiData = users
        .map((user) => {
          const { Followers, email, password, introduction, banner, createdAt, updatedAt, ...restProps } = {
            ...user.toJSON(),
            followersCounts: user.Followers.length,
            isFollowed: theSignInUser.Followings.some((followingUser) => followingUser.id === user.id),
          }
          return restProps
        })
        .sort((a, b) => b.followersCounts - a.followersCounts)
        .slice(0, 10)

      res.status(200).json(topUsersApiData)
    } catch (error) {
      next(error)
    }
  },
  postFollowship: async (req, res, next) => {
    try {
      const theSignInUser = helpers.getUser(req)
      const { id } = req.body

      const [targetUser, followship] = await Promise.all([
        User.findByPk(id),
        Followship.findOne({
          where: {
            followerId: theSignInUser.id,
            followingId: id,
          },
        }),
      ])

      if (!targetUser) throw new Error(`This user doesn't exist!`)
      if (followship) throw new Error(`User is following the target user!`)

      await Followship.create({
        followerId: theSignInUser.id,
        followingId: id,
      })

      res.status(200).json({ status: 'success' })
    } catch (error) {
      next(error)
    }
  },
  deleteFollowship: async (req, res, next) => {
    try {
      const theSignInUser = helpers.getUser(req)
      const { followingId } = req.params
      const [targetUser, followship] = await Promise.all([
        User.findByPk(followingId),
        Followship.findOne({
          where: {
            followerId: theSignInUser.id,
            followingId: followingId,
          },
        }),
      ])

      if (!targetUser) throw new Error(`This user doesn't exist!`)
      if (!followship) throw new Error(`You haven't followed this user!`)

      await Followship.destroy({
        where: { follower_id: theSignInUser.id, following_id: followingId },
      })

      res.status(200).json({ status: 'success' })
    } catch (error) {
      next(error)
    }
  },
}

module.exports = followshipController
