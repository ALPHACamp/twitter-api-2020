const { User, Followship } = require('../models')
const helpers = require('../_helpers')

const followshipController = {
  // feature: user can see 10 users having the most followers
  // route: GET /api/followships/top_users
  getTopUsers: async (req, res, next) => {
    try {
      const currentUser = helpers.getUser(req)
      const targetUsers = await User.findAll({
        where: { role: 'user' },
        include: [{ model: User, as: 'Followers' }]
      })

      if (!targetUsers) throw new Error('Target users not exist.')

      const topUsersApiData = targetUsers
        .map((user) => {
          const { Followers, role, email, password, introduction, banner, createdAt, updatedAt, ...restProps } = {
            ...user.toJSON(),
            followerCounts: user.Followers.length,
            isFollowed: currentUser.Followings.some((followingUser) => followingUser.id === user.id)
          }
          return restProps
        })
        .sort((a, b) => b.followerCounts - a.followerCounts)
        .slice(0, 10)

      res.json(topUsersApiData)
    } catch (error) {
      next(error)
    }
  },
  // feature: user can follow another user, but can't follow itself
  // route: POST /api/followships
  postFollowship: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req)?.id
      const { id } = req.body

      if (!id) throw new Error('Target user id is required.')
      if (currentUserId === id) throw new Error(`Current uesr can't follow itself.`)

      const admins = await User.findAll({
        where: { role: 'admin' },
        raw: true
      })
      const isAdminId = admins.some(admin => admin.id === id)

      if (isAdminId) throw new Error(`Current uesr can't follow admin.`)

      const [targetUser, followship] = await Promise.all([
        User.findByPk(id),
        Followship.findOne({
          where: {
            followerId: currentUserId,
            followingId: id
          }
        })
      ])

      if (!targetUser) throw new Error(`Target user doesn't exist.`)
      if (followship) throw new Error(`User has already followed the target user.`)

      await Followship.create({
        followerId: currentUserId,
        followingId: id
      })

      res.json({
        status: 'success'
      })
    } catch (error) {
      next(error)
    }
  },
  // feature: user can unfollow another user
  // route: DELETE /api/followships/:followingId
  deleteFollowship: async (req, res, next) => {
    try {
      const currentUserId = helpers.getUser(req)?.id
      const { followingId } = req.params

      if (!Number(followingId)) throw new Error('Params target user id is required.')

      const admins = await User.findAll({
        where: { role: 'admin' },
        raw: true
      })
      const isAdminId = admins.some(admin => admin.id === followingId)

      if (isAdminId) throw new Error(`Current uesr can't unfollow admin.`)

      const [targetUser, followship] = await Promise.all([
        User.findByPk(followingId),
        Followship.findOne({
          where: {
            followerId: currentUserId,
            followingId: followingId
          }
        })
      ])

      if (!targetUser) throw new Error('Target user not exist.')
      if (!followship) throw new Error('You have not followed target user.')

      await Followship.destroy({
        where: { follower_id: currentUserId, following_id: followingId }
      })

      res.json({
        status: 'success'
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = followshipController
