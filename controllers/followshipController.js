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
      const user = helpers.getUser(req)

      // get the top 10 most followed users
      const follows = await sequelize.query(
        `SELECT followingId AS id, COUNT(*) AS followerCount
        FROM Followships
        GROUP BY followingId
        ORDER BY followerCount DESC
        LIMIT 10 `,
        { type: sequelize.QueryTypes.SELECT }
      )

      // get the data for each follow
      const data = await Promise.all(
        follows.map(async follow => {
          // if the user is themselves, return null
          if (follow.id === user.id) return null
          //  get user data
          const followingUser = await User.findByPk(follow.id, {
            attributes: ['id', 'name', 'account', 'avatar']
          })
          // if no followingUser is found, return null
          if (!followingUser) {
            return null
          }
          // check if the current user is following this user
          const isFollowed = await Followship.findOne({
            where: {
              followingId: followingUser.id,
              followerId: user.id
            }
          })

          return {
            FollowingId: followingUser.id,
            FollowingName: followingUser.name,
            FollowingAccount: followingUser.account,
            FollowingAvatar: followingUser.avatar,
            isFollowed: !!isFollowed
          }
        })
      )
      // filter out any null entries
      const filteredData = data.filter(item => item !== null)

      return res.status(200).json(filteredData)
    } catch (err) {
      next(err)
    }
  }
}
module.exports = followshipController
