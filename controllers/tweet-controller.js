const { User, Tweet, Reply, Like } = require('../models')
const { getUser } = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      let tweets = await Tweet.findAll({
        include: [
          { model: User },
          { model: Reply },
          { model: Like }],
        order: [['createdAt', 'DESC']]
      })
      if (!tweets) {
        return res.status(400).json({
          status: 'error',
          message: 'Tweet不存在'
        })
      }

      const likes = getUser(req, 'LikedTweets')

      tweets = await tweets.map(tweet => tweet.toJSON())
      tweets = tweets.map(tweet => {
        delete tweet.User.password
        return {
          ...tweet,
          id: tweet.id,
          UserId: tweet.UserId,
          description: tweet.description,
          createdAt: tweet.createdAt,
          updatedAt: tweet.updatedAt,
          replyCount: tweet.Replies.length,
          likeCount: tweet.Likes.length,
          liked: likes ? likes.includes(tweet.id) : false
        }
      })
      return res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  }
}


module.exports = tweetController
