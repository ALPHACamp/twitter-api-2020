const { Tweet, User, Reply, Like } = require('../models')
const helpers = require('../_helpers')
const tweetController = {
  postTweet: async (req, res, next) => {
    try {
      const reqUserId = helpers.getUser(req).id
      const { description } = req.body
      // 檢查推文內容是否為空白或超過字數限制
      if (!description || description.length > 140) throw new Error('字數超過限制')
      // 將推文存入資料庫
      const tweet = await Tweet.create({
        description,
        UserId: reqUserId
      })
      return res.status(200).json({ message: '發送成功' })
    } catch (err) {
      next(err)
    }
  },
  getTweets: async (req, res, next) => {
    try {
      const reqUserId = helpers.getUser(req).id
      let tweets = await Tweet.findAll({
        // raw: true,  使用這個就不能sequelize相關功能
        nest: true,
        include: [User, Reply, Like],
        order: [['createdAt', 'DESC']]
      })
      tweets = tweets.map(tweet => ({
        id: tweet.id,
        UserId: tweet.UserId,
        description: tweet.description,
        createdAt: tweet.createdAt,
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length,
        isLiked: tweet.Likes.some(like => like.UserId === reqUserId), // 檢查貼文是否被當前使用者點讚
        user: {
          avatar: tweet.User.avatar,
          name: tweet.User.name,
          account: tweet.User.account
        }
      }))
      return res.status(200).json(tweets)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const reqUserId = helpers.getUser(req).id
      // const reqUserId = helpers.getUser(req).id
      const tweetId = req.params.tweet_id
      let tweet = await Tweet.findByPk(tweetId, {
        include: [User, Like, Reply]
      })

      if (!tweet) throw new Error('Tweet not found')

      tweet = {
        id: tweet.id,
        description: tweet.description,
        createdAt: tweet.createdAt,
        updatedAt: tweet.updatedAt,
        likeCount: tweet.Likes.length,
        replyCount: tweet.Replies.length,
        isLiked: tweet.Likes.some(like => like.UserId === reqUserId), // 檢查貼文是否被當前使用者點讚
        user: {
          name: tweet.User.name,
          account: tweet.User.account,
          avatar: tweet.User.avatar
        }

      }

      return res.status(200).json(tweet)
    } catch (error) {
      next(error)
    }
  },

  getTweetLikes: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const likes = await Like.findAll({
        where: { TweetId: tweetId },
        include: { model: User }
      })

      if (!likes) {
        return res.status(404).json({ message: 'Likes not found' })
      }

      const likedUsers = likes.map(like => ({
        id: like.User.id,
        name: like.User.name,
        account: like.User.account,
        avatar: like.User.avatar
      }))

      return res.status(200).json(likedUsers)
    } catch (err) {
      next(err)
    }
  },

  postReply: async (req, res, next) => {
    try {
      const { comment } = req.body
      if (!comment) throw new Error('Comment is required!')
      const userId = helpers.getUser(req).id
      const user = await User.findByPk(userId)
      if (!user) throw new Error("User didn't exist")
      const tweetId = req.params.tweet_id
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) throw new Error("Tweet didn't exist")
      await Reply.create({
        comment,
        TweetId: tweetId,
        UserId: userId
      })
      return res.status(200).json({ message: 'Reply posted successfully!' })
    } catch (err) { next(err) }
  },

  getReplies: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const replies = await Reply.findAll({
        where: { TweetId: tweetId },
        include: { model: User },
        order: [['createdAt', 'DESC']]
      })
      if (!replies) throw new Error("replies didn't exist")
      return res.status(200).json(replies)
    } catch (err) { next(err) }
  }
}

module.exports = tweetController
