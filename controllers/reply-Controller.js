const { Reply, User, Tweet } = require('../models')
const helpers = require('../_helpers')

const replyController = {
  add:async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const tweetId = req.params.tweet_id

      const { comment } = req.body
      if (!comment) throw new Error('回覆不可空白')
      if (comment.length > 140) throw new Error('回覆提交字數過長')
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) throw new Error('無法回覆不存在的推文')

      const reply = await Reply.create({ 
        userId, tweetId, comment 
      })
      res.status(200).json({
        message: '您已成功回覆該則推文',
        reply
      })
    } catch (err) {
      next(err)
    }
  },
  getAll:async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id     
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) throw new Error('推文不存在')
      const replies = await Reply.findAll({
        where: { tweetId },
        include: [{
          model: Tweet,
          attributes: ['id'],
          include: [{ model: User, attributes: ['account'] }]
        },
        {
          model: User,
          attributes: ['name', 'account', 'avatar']
        }],
        nest: true,
        raw: true,
        order: [['created_at', 'DESC']]
      })

      res.status(200).json({
        message: '您已成功！',
        replies
      })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = replyController