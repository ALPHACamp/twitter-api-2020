const { User, Tweet, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      let tweets = await Tweet.findAll({
        include: [
          { model: User },
          { model: User, as: 'LikedUsers' },
          { model: Reply }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      if (!tweets) {
        return res.status(500).json({
          status: 'error',
          message: 'Tweets not find!'
        })
      }
      tweets = tweets.map(tweet => {
        return {
          ...tweet,
          description: tweet.description,
          repliedCount: tweet.Replies.length,
          likedCount: tweet.LikedUser.length,
          liked: req.user.LikedTweets ? req.user.LikedTweets.some(l => l.id === tweet.id) : false
        }
      })
      return res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  createTweet: async(req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)

      const { UserId, description } = req.body
      if (!UserId) {
        return res.status(500).json({
          status: 'error',
          message: '查無使用者!'
        })
      }
      if (!description.length) {
        return res.status(500).json({
          status: 'error',
          message: '內容不可以空白!'
        })
      }
      if (description.length > 140) {
        return res.status(500).json({
          status: 'error',
          message: '字數不可以大於140字!'
        })
      }
      await Tweet.create({
        UserId: userId,
        description
      })
      return res.status(200).json({
        status: 'success',
        message: '成功建立Tweet'
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
