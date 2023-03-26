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
  },
  postReply: async (req, res, next) => {
    try {
      const { tweetId } = req.params
      const { comment } = req.body
      const UserId = helpers.getUser(req).id

      const tweet = await Tweet.findByPk(tweetId)

      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: '找不到此則推文，無法進行回覆'
        })
      }

      if (!comment || !comment.trim()) {
        return res.status(400).json({
          status: 'error',
          message: '請輸入內容，內容不能為空白'
        })
      }

      const reply = await Reply.create({
        UserId,
        TweetId: tweet.id,
        comment
      })

      return res.status(200).json({
        status: 'success',
        message: '您已成功在此則推文下發布了回覆',
        reply
      })
    } catch (err) {
      next(err)
    }
  },
  likeTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.tweetId
      // 查找推文
      const tweet = await Tweet.findByPk(TweetId)
      // 找不到推文，則返回出錯誤提示
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: '找不到此則推文，無法按喜歡'
        })
      }
      // 檢查是否已經按過喜歡
      const liked = await Like.findOne({
        where: { UserId, TweetId }
      })
      // 如果按過喜歡，則返回錯誤提示
      if (liked) {
        return res.status(400).json({
          status: 'error',
          message: '你已經點讚過此則推文'
        })
      }
      // 沒按過喜歡，則創建一條新的like紀錄
      await Like.create({
        UserId,
        TweetId
      })

      return res.status(200).json({
        status: 'success',
        message: '你已經成功點讚此則推文'
      })
    } catch (err) {
      next(err)
    }
  },
  unlikeTweet: async (req, res, next) => {
    try {
      const UserId = helpers.getUser(req).id
      const TweetId = req.params.tweetId
      // 查找推文
      const tweet = await Tweet.findByPk(TweetId)
      // 找不到推文，則返回出錯誤提示
      if (!tweet) {
        return res.status(404).json({
          status: 'error',
          message: '找不到此則推文，無法按喜歡'
        })
      }
      // 檢查是否已經按過喜歡
      const liked = await Like.findOne({
        where: { UserId, TweetId }
      })
      if (liked === null) {
        return res.status(400).json({
          status: 'error',
          message: '你沒有點讚過此則推文'
        })
      }

      // 如果按過喜歡，則取消點讚紀錄
      if (liked) {
        liked.destroy()
        return res.status(200).json({
          status: 'success',
          message: '你已經成功取消點讚此則推文'
        })
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController
