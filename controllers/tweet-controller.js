const authHelpers = require('../_helpers')
const { Tweet, User, Like, Reply } = require('../models')

const tweetController = {
  // 回傳所有推文(包含當前使用者回覆以及喜歡的推文)
  getTweets: async (req, res, next) => {
    try {
      const loginUserId = authHelpers.getUser(req).id
      // 推文要包含作者
      const tweets = await Tweet.findAll({
        include: [
          { model: User, as: 'TweetAuthor', attributes: { exclude: ['password'] } }
        ],
        order: [
          ['createdAt', 'DESC']
        ],
        nest: true
      })

      // 獲取一個目前使用者所喜歡的推文之清單
      const likeTweets = await Like.findAll({
        attributes: ['TweetId'],
        where: { UserId: loginUserId },
        raw: true
      })

      // 獲取一個目前使用者所回覆過的推文之清單
      const replyTweets = await Reply.findAll({
        attributes: ['TweetId'],
        where: { UserId: loginUserId },
        raw: true
      })

      // 回傳一份所有推文清單(若目前使用者有喜歡或有評論會用isLiked和isReplied來標記)
      const results = tweets.map(tweet => {
        return {
          ...tweet.toJSON(),
          isLiked: likeTweets.some(lt => lt.TweetId === tweet.id),
          isReplied: replyTweets.some(rt => rt.TweetId === tweet.id)
        }
      })

      return res
        .status(200)
        .json(results)

    } catch (error) {
      // 系統出錯
      error.code = 500
      return next(error)
    }
  }
}

exports = module.exports = tweetController