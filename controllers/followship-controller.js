const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  getTopUsers: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req).toJSON()
      const users = await User.findAll({
        include: [{ model: User, as: 'Followers' }],
      })

      const topUsersApiData = users
        .map((user) => {
          const { Followers, email, password, introduction, banner, createdAt, updatedAt, ...restProps } = {
            ...user.toJSON(),
            followersCounts: user.Followers.length,
            isFollowed: currentUser.Followings.some((followingUser) => followingUser.id === user.id),
          }
          return restProps
        })
        .sort((a, b) => b.followersCounts - a.followersCounts)
        .slice(0, 10)

      res.json(topUsersApiData)
    } catch (error) {
      next(error)
    }
  },
  postFollowship: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const { id } = req.body

      if (currentUser.id === id) throw new Error(`Uesr can't follow`)

      const [targetUser, followship] = await Promise.all([
        User.findByPk(id),
        Followship.findOne({
          where: {
            followerId: currentUser.id,
            followingId: id,
          },
        }),
      ])

      if (!targetUser) throw new Error(`This user doesn't exist!`)
      if (followship) throw new Error(`User is following the target user!`)

      await Followship.create({
        followerId: currentUser.id,
        followingId: id,
      })

      res.json({ status: 'success' })
    } catch (error) {
      next(error)
    }
  },
  deleteFollowship: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const { followingId } = req.params
      const [targetUser, followship] = await Promise.all([
        User.findByPk(followingId),
        Followship.findOne({
          where: {
            followerId: currentUser.id,
            followingId: followingId,
          },
        }),
      ])

      if (!targetUser) throw new Error(`This user doesn't exist!`)
      if (!followship) throw new Error(`You haven't followed this user!`)

      await Followship.destroy({
        where: { follower_id: currentUser.id, following_id: followingId },
      })

      res.json({ status: 'success' })
    } catch (error) {
      next(error)
    }
  },
}

module.exports = followshipController
