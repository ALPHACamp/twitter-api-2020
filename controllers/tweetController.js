const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like
const helpers = require('../_helpers')

const tweetController = {
  postTweets: async (req, res) => {
    try {
      const { description } = req.body
      const UserId = helpers.getUser(req).id

      if (!description) {
        return res.json({
          status: 'error',
          message: 'input should not be blank'
        })
      }

      if (description.length > 140) {
        return res.json({
          status: 'error',
          message: 'input should be less than 140 characters'
        })
      }

      await Tweet.create({
        UserId,
        description,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const tweet = await Tweet.findAll({
        raw: true,
        nest: true,
        limit: 1,
        order: [['createdAt', 'DESC']]
      })

      return res.status(200).json({
        status: 'success',
        message: 'successfully posted a tweet',
        tweet
      })
    } catch (error) {
      console.log(error)
    }
  },
  getTweets: async (req, res) => {
    try {
      let tweets = await Tweet.findAll({
        include: [User, Reply, Like]
      })

      tweets = tweets.map(tweet => ({
        id: tweet.id,
        UserId: tweet.UserId,
        description: tweet.description,
        createdAt: tweet.createdAt,
        updatedAt: tweet.updatedAt,
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length,
        user: {
          avatar: tweet.User.avatar,
          name: tweet.User.name,
          account: tweet.User.account
        }
      }))
      return res.json(tweets)
    } catch (error) {
      console.log(error)
    }
  },

  getTweet: async (req, res) => {
    try {
      const TweetId = req.params.tweet_id
      const tweet = await Tweet.findByPk(TweetId)
      return res.json(tweet)
    } catch (error) {
      console.log(error)
    }
  },

  likeTweet: async (req, res) => {
    try {
      const UserId = helpers.getUser(req).id
      await Like.create({
        UserId,
        TweetId: req.params.tweet_id
      })
      return res.json({ status: 'success' })  // 可問問看前端是否需要回傳資料
    }
    catch (error) {
      console.log(error)
    }
  },

  unlikeTweet: async (req, res) => {
    try {
      const UserId = helpers.getUser(req).id
      const like = await Like.findOne({
        where: {
          UserId,
          TweetId: req.params.tweet_id
        }
      })
      await like.destroy()
      return res.json({ status: 'success' })  // 可問問看前端是否需要回傳資料
    }
    catch (error) {
      console.log(error)
    }
  },

  postReply: async (req, res) => {
    try {
      const TweetId = req.params.tweet_id
      const targetTweet = await Tweet.findOne({ where: { id: TweetId } })
      const UserId = helpers.getUser(req).id

      if (!targetTweet) {
        return res.json({
          status: 'error',
          message: 'cannot reply to a tweet that doesn\'t exist'
        })
      }

      const tweetAuthor = await User.findOne({ where: { id: targetTweet.UserId } })

      if (!req.body.comment || req.body.comment === '') {
        return res.json({
          status: 'error',
          message: 'comment cannot be blank'
        })
      }

      await Reply.create({
        UserId,
        TweetId,
        comment: req.body.comment,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return res.json({
        status: 'success',
        message: `successfully replied to ${tweetAuthor.account}'s tweet`
      })
    }
    catch (error) {
      console.log(error)
    }
  },

  getReplies: async (req, res) => {
    try {
      const TweetId = req.params.tweet_id
      const targetTweet = await Tweet.findOne({ where: { id: TweetId } })

      if (!targetTweet) {
        return res.json({
          status: 'error',
          message: 'this tweet doesn\'t exist'
        })
      }

      const replies = await Reply.findAll({ raw: true, nest: true, where: { TweetId } })
      return res.json(
        replies
        // 因測試檔希望回傳的 res.body 是陣列，並且此陣列[0] 就是第一個 reply data，故只能將 res.json() 中的大花括號拿掉以符合測試格式。POSTMAN 測試沒問題。
        // 取資料時要跟前端講一下串資料的方式

        // status: 'success',
        // message: `successfully retrieve replies for TweetId: ${TweetId}`

      )
    }
    catch (error) {
      console.log(error)
    }
  }
}

module.exports = tweetController
