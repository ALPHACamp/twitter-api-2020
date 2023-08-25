const { Tweet, Like, Reply, User } = require('../../models')
const helpers = require('../../_helpers')

const tweetContorller = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAll({
        raw: true
      })
      if (!tweets) throw new Error("Tweet didn't exist!")
      res.json({
        tweets
      })
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const tweet = await Tweet.findByPk(tweetId)

      if (!tweet) throw new Error("Tweet didn't exist!")
      res.json({
        status: 'success',
        data: tweet
      })
    } catch (err) {
      next(err)
    }
  },
  likeTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const getUser = helpers.getUser(req)
      const userId = getUser.id
      const [tweet, like] = await Promise.all([
        Tweet.findByPk(tweetId),
        Like.findOne({
          where: {
            userId,
            tweetId
          }
        })
      ])
      if (!tweet) throw new Error("Tweet didn't exist!")
      if (like) throw new Error('You have liked this tweet!')
      const createdLike = await Like.create({
        userId,
        tweetId
      })
      res.json({
        status: 'success',
        data: createdLike,
        Boolean: true
      })
    } catch (err) {
      next(err)
    }
  },
  unlikeTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const getUser = helpers.getUser(req)
      const userId = getUser.id
      const [tweet, like] = await Promise.all([
        Tweet.findByPk(tweetId),
        Like.findOne({
          where: {
            userId,
            tweetId
          }
        })
      ])
      if (!tweet) throw new Error("Tweet didn't exist!")
      if (!like) throw new Error("You haven't liked this tweet!")
      const unlike = await Like.destroy({
        where: {
          userId,
          tweetId
        }
      })
      res.json({
        status: 'success',
        data: unlike,
        Boolean: false
      })
    } catch (err) {
      next(err)
    }
  },
  createTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      if (!description) throw new Error('文章內容不可為空白')
      const createdTweet = await Tweet.create({
        description,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      res.status(200).json({
        status: 'success',
        message: 'Successfully create tweet.',
        data: createdTweet
      })
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const replies = await Reply.findAll({
        where: { tweetId },
        include: [
          {
            model: User,
            as: 'replier',
            attributes: { exclude: ['password'] }
          },
          {
            model: Tweet,
            as: 'tweetreply',

            include: [
              {
                model: User,
                as: 'author',
                attributes: ['account', 'name', 'avatar']
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        nest: true
        // raw: true // 為何設true就無法取資料？
      })

      if (!replies) throw new Error('This tweet has no replies')
      // console.log(replies);
      const repliesData = replies.map(reply => ({
        replyId: reply.id,
        comment: reply.comment,
        replierId: reply.replier.id,
        replierName: reply.replier.name,
        replierAvatar: reply.replier.avatar,
        replierAccount: reply.replier.account,
        createdAt: reply.createdAt,
        tweetId: reply.TweetId,
        tweetBelongerName: reply.tweetreply.author.name,
        tweetBelongerAccount: reply.tweetreply.author.account
      }))
      console.log(repliesData)
      res.json({
        status: 'success',
        data: repliesData
      })
    } catch (err) {
      next(err)
    }
  },
  createReply: async (req, res, next) => {
    try {
    } catch (err) {
      next(err)
    }
  },
  getLikes: async (req, res, next) => {
    try {
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetContorller
