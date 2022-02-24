const { Tweet, User, Reply, Like, Followship } = require('../models')
const sequelize = require('sequelize')
const helper = require('../_helpers')
const followServices = {
  postFollowships: async (req, cb) => {
    try {
      const userId = helper.getUser(req).id
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
      return cb(null, followship)
    } catch (err) {
      cb(err)
    }
  },
}
module.exports = followServices