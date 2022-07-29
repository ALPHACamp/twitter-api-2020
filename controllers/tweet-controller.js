const { User, Tweet, Reply, Like } = require('../models')
const helpers = require('../_helpers')
const { getUser } = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      let tweets = await Tweet.findAll({
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name', 'avatar', 'introduction', 'role', 'front_cover']
          },
          {
            model: Reply,
            attributes: ['id']
          },
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
  },
  postTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req)?.id
      const { description } = req.body
      if (description.length > 140) {
        res.status(500).json({
          status: 'error',
          message: '字數不可以超過140字!'
        })
      }
      if (!description.trim()) {
        res.status(500).json({
          status: 'error',
          message: '推文內容不可以空白!'
        })
      }
      const tweet = await Tweet.create({
        description,
        UserId
      })

      return res.status(200).json({
        status: 'success',
        message: '成功建立一則推文!',
        tweet
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
