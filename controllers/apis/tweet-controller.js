const { Tweet, Like, Reply, User } = require('../../models')
const helpers = require('../../_helpers')

const tweetContorller = {
  getTweets: async (req, res, next) => {
    try {
      const getUser = helpers.getUser(req)
      const userId = getUser.id
      const options = {
        attributes: [
          'id',
          'description',
          'likeCount',
          'replyCount',
          'createdAt'
        ],
        order: [['createdAt', 'desc']],
        subQuery: false,
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name', 'avatar'],
            as: 'author',
            where: { role: 'user' }
          },
          {
            model: Like
          },
          {
            model: Reply,
            as: 'replies'
          }
        ]
      }
      const tweets = await Tweet.findAll(options)
      console.log(tweets)
      const dataTweets = tweets.map(tweet => ({
        id: tweet.id,
        authorId: tweet.author.id,
        authorAccount: tweet.author.account,
        authorName: tweet.author.name,
        authorAvatar: tweet.author.avatar,
        description: tweet.description.substring(0, 140),
        likeCount: tweet.Likes.length,
        replyCount: tweet.replies.length,
        isLiked: tweet.Likes.some(i => i.userId === userId),
        createdAt: tweet.createdAt
      }))
      res.status(200).json(dataTweets)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const getUser = helpers.getUser(req)
      const userId = getUser.id
      const tweet = await Tweet.findOne({
        where: { id: tweetId },
        include: [
          {
            model: User,
            attributes: ['id', 'account', 'name', 'avatar'],
            as: 'author'
          },
          {
            model: Like
          },
          {
            model: Reply,
            as: 'replies'
          }
        ]
      })

      if (!tweet) throw new Error("Tweet didn't exist!")
      console.log(tweet)

      const tweetData = [tweet].map(t => ({
        id: t.id,
        authorName: t.author.name,
        authorAccount: t.author.account,
        authorAvatar: t.author.avatar,
        description: t.description,
        likeCount: tweet.Likes.length,
        replyCount: tweet.replies.length,
        isLiked: t.Likes.some(i => i.userId === userId),
        createdAt: t.createdAt
      }))
      res.status(200).json(tweetData)
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

      res.status(200).json({
        status: 'success',
        data: createdLike,
        isLiked: true
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
      await Like.destroy({
        where: {
          userId,
          tweetId
        }
      })
      res.status(200).json({
        status: 'success',
        isLiked: false
      })
    } catch (err) {
      next(err)
    }
  },
  createTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      const getUser = helpers.getUser(req)
      const userId = getUser.id
      if (!description) throw new Error('文章內容不可為空白')
      if (description.length > 140) throw new Error('文章內容不可超過 140 字')
      const createdTweet = await Tweet.create({
        userId,
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
        nest: true,
        raw: true
      })

      if (!replies) throw new Error('This tweet has no replies')
      console.log(replies)
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

      res.status(200).json(repliesData)
    } catch (err) {
      next(err)
    }
  },
  createReply: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const { comment } = req.body
      const getUser = helpers.getUser(req)
      const userId = getUser.id
      const createdAt = new Date()
      const updatedAt = new Date()

      if (!comment) throw new Error('回覆內容不可為空白')
      const [reply, currentUser, tweet] = await Promise.all([
        Reply.create({
          tweetId,
          userId,
          comment,
          createdAt,
          updatedAt
        }),
        User.findOne({
          where: { id: userId },
          attributes: ['name', 'account', 'avatar'],
          raw: true,
          nest: true
        }),

        Tweet.findOne({
          where: { id: tweetId },
          attributes: ['id'],
          nest: true,
          raw: true,
          include: {
            model: User,
            as: 'author',
            attributes: ['account']
          }
        })
      ])
      console.log(reply, currentUser, tweet)
      const replyData = {
        id: reply.dataValues.id,
        tweetId,
        userId,
        userAvatar: currentUser.avatar,
        userName: currentUser.name,
        userAccount: currentUser.account,
        authorAccount: tweet.author.account,
        comment,
        createdAt,
        updatedAt
      }
      console.log(replyData)
      res.status(200).json({
        status: 'success',
        message: 'successfully created reply',
        replyData
      })
    } catch (err) {
      next(err)
    }
  },
  getLikes: async (req, res, next) => {
    try {
      const tweetId = req.params.tweet_id
      const [tweet, likes] = await Promise.all([
        Tweet.findByPk(tweetId),
        Like.findAll({
          where: {
            tweetId
          },
          nest: true,
          raw: true,
          include: [
            {
              model: User,
              attributes: { exclude: ['password', 'introduction', 'cover'] }
            }
          ]
        })
      ])

      if (!tweet) throw new Error("Tweet didn't exist!")
      if (!likes) throw new Error('NO ONE liked this tweet!')
      const likedData = likes.map(like => ({
        likedId: like.id,
        likedTweetId: like.tweetId,
        likedUserId: like.User.id,
        likedUserName: like.User.name,
        likedUserAccount: like.User.account,
        likedUserAvatar: like.User.avatar
      }))
      res.status(200).json({
        status: 'success',
        message: 'successfully get all the liked users',
        likedData
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetContorller
