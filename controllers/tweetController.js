const { getUser, ensureAuthenticated } = require('../_helpers')
// const helpers = require('../_helpers')
const { Op } = require('sequelize')
const { User, Tweet, Reply, Like, Followship, sequelize } = require('../models')

const tweetController = {
  getTweets: async (req, res, next) => {
    // const user = helpers.getUser(req) // 使用 helpers.getUser 來取得用戶
    // if (!helpers.ensureAuthenticated(req)) {
    // 使用 helpers.ensureAuthenticated 進行身份驗證
    //   return res.status(401).json({ error: 'Unauthorized' })
    // }
    // 確認user存在
    try {
      // getUser(req)
      // ensureAuthenticated(req)
      // console.log(req)
      // console.log(req.user)
      // if (!(user instanceof User)) {
      //   return res.status(400).json({ error: 'User not found' })
      // }
      // console.log(user)
      // const userData = user.get({ plain: true })
      // delete user.password
      // console.log(userData)

      // 先找到user追蹤的人
      // const followships = await Followship.findAll({
      //   where: { followerId: userData.id },
      //   attributes: ['followingId'],
      //   raw: true
      // })
      // const followingIds = followships.map(followship => followship.followingId)

      const tweets = await Tweet.findAll({
        attributes: [
          'id',
          'description',
          'createdAt',
          [
            sequelize.fn('COUNT', sequelize.col('Replies.TweetId')),
            'replyCount'
          ],
          [sequelize.fn('COUNT', sequelize.col('Likes.TweetId')), 'likeCount']
        ],
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'account', 'avatar']
            // where: {
            //   id: {
            //     [Op.in]: followingIds
            //   }
            // }
          },
          {
            model: Reply,
            attributes: []
          },
          {
            model: Like,
            // where: { isLiked: true },
            attributes: []
          }
        ],
        group: ['Tweet.id', 'User.id'],
        order: [['createdAt', 'DESC']],
        raw: true
      })

      const data = tweets.map(tweet => {
        return {
          tweetId: tweet.id,
          description: tweet.description,
          userId: {
            id: tweet['User.id'],
            name: tweet['User.name'],
            avatar: tweet['User.avatar'],
            account: tweet['User.account']
          },
          tweetTime: tweet.createdAt,
          replyCount: tweet.replyCount || 0,
          likeCount: tweet.likeCount || 0
        }
      })

      return res.status(200).json(
        // {tweets: data}
        data
      )
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      // Ensure the user is authenticated
      if (!ensureAuthenticated(req)) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      console.log(req)
      // 取得發文者id
      // const req = ensureAuthenticated()
      // getUser(req);
      const user = getUser(req)
      // user.ensureAuthenticated();
      console.log(user);

      if (!user || !user.id) {
        return res.status(400).json({ error: 'User not found' })
      }
      const { description } = req.body
      // if (!description) {
      //   return res.status(400).json({ error: 'Description is required!' })
      // }
      // Check if description is more than 160 characters
      if (description.trim().length > 140) {
        return res
          .status(400)
          .json({ error: 'Description should be within 160 characters!' })
      }
      // Check if description is whitespace
      if (!description.trim().length) {
        return res
          .status(400)
          .json({ error: 'Description cannot be only whitespace!' })
      }
      console.log(user)
      const UserId = user.id

      // 創建新的Tweet
      const newTweet = await Tweet.create({
        description,
        UserId
      })
      // 回傳成功訊息與新的tweet
      return (
        res
          .status(201)
          // .json({ message: 'Tweet successfully posted!', tweet: [newTweet] })
          .json([newTweet])
      )
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.params.tweet_id, {
        attributes: ['id', 'description', 'createdAt'],
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'account', 'avatar']
          },
          {
            model: Reply,
            attributes: ['id', 'comment', 'createdAt'],
            include: [
              {
                model: User,
                attributes: ['id', 'account', 'name', 'avatar']
              }
            ]
          },
          {
            model: Like,
            attributes: []
          }
        ]
      })
      if (!tweet) {
        return res.status(404).json({ error: 'Tweet not found!' })
      }
      const tweetData = tweet.get({ plain: true })
      // console.log(tweetData)

      tweetData.replyCount = tweet.Replies ? tweet.Replies.length : 0
      tweetData.likeCount = tweet.Likes ? tweet.Likes.length : 0
      // console.log(tweetData.Replies)

      tweetData.Replies = tweet.Replies.map(reply => {
        const { id, comment, createdAt, User } = reply
        return {
          replyId: id,
          replyComment: comment,
          replyTime: createdAt,
          User: User
        }
      })

      return res.status(200).json(
        // { tweet: [tweetData] }
        [tweetData]
      )
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const { tweet_id: tweetId } = req.params
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) {
        return res.status(404).json({ error: 'Tweet not found!' })
      }

      const replies = await Reply.findAll({
        raw: true,
        nest: true,
        where: { TweetId: tweetId },
        order: [['createdAt', 'DESC']]
      })

      return res.status(200).json(replies)
    } catch (err) {
      next(err)
    }
  },
  postReply: async (req, res, next) => {
    try {
      const { tweet_id: tweetId } = req.params
      const tweet = await Tweet.findByPk(tweetId)
      if (!tweet) {
        return res.status(404).json({ error: 'Tweet not found!' })
      }
      const { comment } = req.body
      // Check if comment is whitespace
      if (!comment.trim().length) {
        return res
          .status(400)
          .json({ error: 'Comment cannot be only whitespace!' })
      }
      // Get user id
      const user = getUser(req)
      if (!user || !user.id) {
        return res.status(400).json({ error: 'User not found' })
      }
      const UserId = user.id

      // Create new reply
      const newReply = await Reply.create({
        comment,
        UserId,
        TweetId: tweetId
      })

      return (
        res
          .status(201)
          // .json({ message: 'Tweet successfully posted!', tweet: [newTweet] })
          .json(newReply)
      )
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
