const { Tweet, User, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getAllTweet: async (req, res, next) => {
    try {
      const rawTweets = await Tweet.findAll({
        include: [
          {
            model: User,
            attributes: ['name', 'account', 'avatar']
          },
          {
            model: Like,
            attributes: ['tweet_id', 'user_id']
          },
          {
            model: Reply,
            attributes: ['tweet_id', 'user_id']
          }
        ],
        order: [
          ['created_at', 'DESC']
        ]
      })

      const tweets = rawTweets.map((tweet, _index) => ({
        ...tweet.toJSON(),
        likeCounts: tweet.Likes.length,
        repliesCounts: tweet.Replies.length
      }))

      res.json(tweets)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      // catch this tweet including replies & likes
      // catch tweet's author
      const rawTweet = await Tweet.findByPk(tweetId, {
        include: [
          {
            model: Like,
            attributes: ['tweet_id', 'user_id']
          },
          {
            model: Reply,
            attributes: ['tweet_id', 'user_id']
          },
          {
            model: User,
            attributes: ['name', 'account', 'avatar']
          }
        ]
      })

      if (!rawTweet) throw new Error('無法查看不存在的推文！')


      const tweet = ({
        ...rawTweet.toJSON(),
        likeCounts: rawTweet.Likes.length,
        repliesCounts: rawTweet.Replies.length
      })

      res.json(tweet)
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const description = req.body.description
      
      if (!description) throw new Error('不可以提交空白的推文。')
      if (description.length > 140) throw new Error('不可以提交字數過長的推文。')

      const rawTweets = await Tweet.create({
        userId,
        description
      })

      const newTweet = rawTweets.toJSON()

      res.json({
        status: 'success',
        message: '已成功新增一筆推文！',
        data: {
          newTweet
        }
      })
    } catch (err) {
      next(err)
    }
  },
  likeTweet: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const tweetId = req.params.id

      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) throw new Error('無法喜歡不存在的推文')

      const likedTweet = await Like.create({
        userId,
        tweetId
      })

      res.json({
        status: 'success',
        message: '你已成功喜歡該筆推文。',
        data: {
          likedTweet
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController