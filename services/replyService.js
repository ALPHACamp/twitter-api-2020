// 載入所需套件
const { Reply, User, Tweet } = require('../models')
const helpers = require('../_helpers')
const ReqError = require('../helpers/ReqError')

const replyService = {
  postReply: async (req, res, callback) => {
    const TweetId = req.params.tweet_id
    const tweet = await Tweet.findByPk(TweetId)
    const { comment } = req.body

    //確認該推文是否存在
    if (!tweet) {
      throw new ReqError('該貼文不存在')
    }

    //確認回覆欄是否有填寫
    if (comment.trim() === '') {
      throw new ReqError('內容不可空白')
    } else {
      await Reply.create({
        comment,
        TweetId,
        UserId: helpers.getUser(req).id,
      })
    }
    return callback({ status: 'success', message: '成功回覆貼文' })
  },

  getReplies: async (req, res, callback) => {
    //撈出特定:tweet_id的reply所有資料，並取得tweet及user關聯資料
    const replies = await Reply.findAll({
      where: { TweetId: req.params.tweet_id },
      raw: true,
      nest: true,
      attributes: {
        exclude: ['updatedAt', 'TweetId', 'UserId']
      },
      include: [
        { model: User, attributes: ['id', 'account', 'name', 'avatar'] },
        {
          model: Tweet, attributes: ['UserId'],
          include: [{ model: User, attributes: ['account'] }]
        }
      ],
    })
    return callback(replies)
  }
}


// replyController exports
module.exports = replyService