const { Tweet, User, Reply, Like } = require('../models')
const sequelize = require('sequelize')
const helper = require('../_helpers')
const replyServices = {
  getReplies: async (req, cb) => {
    try {
      // 找出單一tweet的所有回覆
      const replies = await Reply.findAll({
        where: { tweetId: req.params.id },
        include: [
          // 將回覆的使用者資訊in進來
          { model: User, attributes: ['account', 'name', 'avatar'] },
          // 將原推文的使用者資訊in進來 
          { model: Tweet, include: { model: User, attributes: ['account', 'name'] } },
        ],
        order: [['createdAt', 'DESC']],
        raw: true
      })

      return cb(null, replies)
    } catch (err) {
      cb(err)
    }
  },
}
module.exports = replyServices