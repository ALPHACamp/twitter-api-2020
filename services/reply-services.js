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
      if (replies.length === 0) throw new Error('目前沒有任何回覆')
      return cb(null, replies)
    } catch (err) {
      cb(err)
    }
  },
  postReply: async (req, cb) => {
    try {
      const userId = helper.getUser(req).id
      const tweetId = Number(req.params.id)
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) throw new Error('此推文已不存在')
      const { comment } = req.body
      if (!comment) throw new Error('內容不可空白')
      const reply = await Reply.create({
        userId,
        tweetId,
        comment
      })
      return cb(null, reply)
    } catch (err) {
      cb(err)
    }
  }
}
module.exports = replyServices