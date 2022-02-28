const { Tweet, User, Reply, Like, Followship } = require('../models')
const sequelize = require('sequelize')
const helper = require('../_helpers')
const followServices = {
  postFollowships: async (req, cb) => {
    try {
      const userId = helper.getUser(req).id
      // 判斷使用者是否可以追蹤
      const allowUser = await User.findByPk(req.body.id)
      if (!allowUser || allowUser.role === 'admin') throw new Error(`使用者不存在`)
      // 判斷是否已追蹤
      const isFollowed = await Followship.findOne({
        where: {
          followerId: userId,
          followingId: req.body.id
        }
      })
      if (isFollowed) throw new Error(`已經追蹤過了`)
      // 判斷是否按到自己
      if (userId === Number(req.body.id)) throw new Error('不可以追蹤自己')
      // create
      const followship = await Followship.create({
        followerId: userId,
        followingId: req.body.id
      })
      const followData = await Followship.findOne({
        where: {
          followerId: userId,
          followingId: req.body.id
        }
      })
      const followingUserData = await User.findByPk(req.body.id, {
        attributes: {
          include: [
            [sequelize.literal("(SELECT COUNT(*) FROM Tweets WHERE Tweets.UserId = User.id)"), 'tweetCount'],
            [sequelize.literal("(SELECT COUNT(*) FROM Likes WHERE Likes.UserId = User.id)"), 'likeCount'],
            [sequelize.literal("(SELECT COUNT(*) FROM Replies WHERE Replies.UserId = User.id)"), 'replyCount'],
            [sequelize.literal("(SELECT COUNT(*) FROM Followships WHERE Followships.followerId = User.id)"), 'followingCount'],
            [sequelize.literal("(SELECT COUNT(*) FROM Followships WHERE Followships.followingId = User.id)"), 'followerCount'],
            [sequelize.literal(`EXISTS (SELECT 1 FROM Followships WHERE followerId = ${helper.getUser(req).id} AND followingId = User.id)`), 'isFollowed']
          ],
          exclude: [
            'password'
          ],
        },
      })
      const following = {
        ...followingUserData.toJSON(),
        isFollowed: followingUserData.dataValues.isFollowed ? true : false
      }
      const result = {
        ...followData.toJSON(),
        following
      }
      return cb(null, result)
    } catch (err) {
      cb(err)
    }
  },
  deleteFollowships: async (req, cb) => {
    try {
      const userId = helper.getUser(req).id
      const deletedFollowship = await Followship.findOne({
        where: {
          followerId: userId,
          followingId: req.params.id
        },
        include: [
          { model: User, as: 'Followers', attributes: ['account', 'name'] },
        ],
      })
      if (!deletedFollowship) throw new Error(`尚未追蹤此用戶`)
      await deletedFollowship.destroy()
      return cb(null, deletedFollowship)
    } catch (err) {
      cb(err)
    }
  },
}
module.exports = followServices