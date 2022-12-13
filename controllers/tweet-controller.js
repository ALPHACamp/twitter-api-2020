const sequelize = require('sequelize')
const { getUser } = require('../_helpers')
const { Tweet, User, Like } = require('../models')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        attributes: [ // 指定回傳model欄位
          'id', 'description', 'createdAt',
          [
            sequelize.literal('(SELECT COUNT(*) FROM Replies AS replyCount WHERE tweet_id = Tweet.id)'), 'replyCount' // 回傳留言數
          ],
          [
            sequelize.literal('(SELECT COUNT(*) FROM Likes AS likeCount WHERE tweet_id = Tweet.id)'), 'likeCount' // 回傳按讚數
          ]
        ],
        order: [['createdAt', 'DESC']], // 用建立時間先後排序
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        raw: true,
        nest: true
      })
      // 檢查目前使用者是否like過推文
      const currentUserId = getUser(req)?.id
      const currentUserLiked = await Like.findAll({
        where: { UserId: currentUserId },
        raw: true
      })
      const likedTweetsId = currentUserLiked.map(like => like.TweetId)
      const data = tweets.map(tweet => ({
        ...tweet,
        isLiked: likedTweetsId.some(tweetId => tweetId === tweet.id)
      }))
      res.status(200).json(data)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
