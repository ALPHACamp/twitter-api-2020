const { Tweet, User, Like, Reply, sequelize } = require('../models')
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
      if (!tweet) throw new Error('無法喜歡不存在的推文。')
    
      const [isLiked, created] = await Like.findOrCreate({
        where: {
          userId,
          tweetId
        },
      })

      if (!created) throw new Error('你已經喜歡過該則推文。')

      res.json({
        status: 'success',
        message: '你已成功喜歡該則推文。',
        data: {
          isLiked
        }
      })
    } catch (err) {
      next(err)
    }
  },
  deleteLikeTweet: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id
      const tweetId = req.params.id

      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) throw new Error('無法喜歡不存在的推文。')

      const isLiked = await Like.destroy({
        where: {
          userId,
          tweetId
        }
      })

      if (!isLiked) throw new Error('你沒有喜歡過該則推文。')

      res.json({
        status: 'success',
        message: '你已成功取消喜歡該則推文。',
        data: {
          deletedTweet: tweet.toJSON(), // deleted tweet
        }
      })
    } catch (err) {
      next(err)
    }
  },
  getTweetAllReplies: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.id)
      if (!tweet) throw new Error('無法查找不存在的推文。')

      const replies = await Reply.findAll({
        where: {
          tweetId: req.params.id
        },
        include: [
          { model: User , attributes: ['name', 'account', 'avatar'] }
        ],
        order: [['created_at', 'DESC']],
        rest: true,
        raw: true
      })

      res.json({
        status: 'success',
        data: {
          replies
        }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController