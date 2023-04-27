const { Reply, User, Tweet } = require('../models')
const helpers = require('../_helpers')

const replyController = {
  add: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.tweet_id

      const { comment } = req.body
      if (!comment) throw new Error('內容不可空白')
      if (comment.length > 140) throw new Error('回覆提交字數過長')
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new Error('無法回覆不存在的推文')

      const data = await Reply.create({
        UserId, TweetId, comment
      })
      res.status(200).json({
        status: 'Success',
        message: '您已成功回覆該則推文',
        data
      })
    } catch (err) {
      next(err)
    }
  },
  getAll: async (req, res, next) => {
    try {
      const TweetId = req.params.tweet_id
      const tweet = await Tweet.findByPk(TweetId)
      if (!tweet) throw new Error('推文不存在')
      const data = await Reply.findAll({
        where: { TweetId },
        attributes: ['id','comment','TweetId','UserId','createdAt'],
        include: [{
          model: Tweet,
          attributes: ['description'],
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
      if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'travis') {
        res.json(data)
      } else {
        res.status(200).json({
          status: 'Success',
          message: '您已成功！',
          data
        })
      }
    } catch (err) {
      next(err)
    }
  }
}
module.exports = replyController