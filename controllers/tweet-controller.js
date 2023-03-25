const { Tweet, User, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const userId = helpers.getUser(req).id

      const tweets = await Tweet.findAll({
        order: [['createdAt', 'DESC']],
        include: [User, Reply, Like, { model: User, as: 'LikedUsers' }]
      })

      if (!tweets) {
        return res.status(404).json({ status: 'error', message: '找不到任何推文' })
      }

      const tweetsData = tweets.reduce((result, tweet) => {
        const { id, UserId, description, createdAt, User, Replies, Likes, LikedUsers } = tweet
        result.push({
          id,
          UserId,
          description,
          createdAt,
          name: User.name,
          account: User.account,
          avatar: User.avatar,
          repliedCount: Replies.length,
          likedCount: Likes.length,
          isLike: LikedUsers.some((u) => u.id === userId)
        })
        return result
      }, [])
      return res.status(200).json(tweetsData)
    } catch (err) {
      next(err)
    }
  },
  getTweet: async (req, res, next) => {
    try {
      const { tweetId } = req.params
      const userId = helpers.getUser(req).id

      const tweet = await Tweet.findByPk(tweetId, {
        include: [User, Reply, Like, { model: User, as: 'LikedUsers' }]
      })

      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: '找不到此篇推文'
        })
      }

      const tweetData = {
        id: tweet.id,
        UserId: tweet.UserId,
        description: tweet.description,
        createdAt: tweet.createdAt,
        account: tweet.User.account,
        name: tweet.User.name,
        avatar: tweet.User.avatar,
        repliedCount: tweet.Replies.length,
        likedCount: tweet.Likes.length,
        isLike: tweet.LikedUsers.some((u) => u.id === userId)
      }
      return res.status(200).json({
        status: 'success',
        message: '成功取得此篇推文',
        ...tweetData
      })
    } catch (err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const { description } = req.body
      const UserId = helpers.getUser(req).id

      if (!description || !description.trim()) {
        return res.status(400).json({ status: 'error', message: '請輸入內容，內容不能為空白' })
      }
      if (description.length > 140) {
        return res.status(400).json({ status: 'error', message: '請將推文字數限制在 140 以內' })
      }

      const tweet = await Tweet.create({
        UserId,
        description
      })

      return res.status(200).json({ status: 'success', message: '推文已成功發布', tweet })
    } catch (err) {
      next(err)
    }
  },

  getReplies: async (req, res, next) => {
    try {
      const { tweetId } = req.params

      const tweet = await Tweet.findByPk(tweetId)

      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: '找不到此篇推文'
        })
      }

      const replies = await Reply.findAll({
        where: { tweetId },
        include: [User, { model: Tweet, include: [User] }],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })

      const repliesData = replies.map((reply) => {
        const { id, UserId, TweetId, comment, createdAt } = reply
        return {
          id,
          UserId,
          TweetId,
          comment,
          createdAt,
          tweetAuthorAccount: reply.Tweet.User.account,
          replyAccount: reply.User.account,
          replyName: reply.User.name,
          replyAvatar: reply.User.avatar
        }
      })

      return res.status(200).json(repliesData)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
